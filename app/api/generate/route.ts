import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get('image') as File
    const prompt = formData.get('prompt') as string
    const mode = formData.get('mode') as string

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
    }

    // Convert File → Blob (IMPORTANT)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const imageFile = new File([buffer], "input.png", {
      type: file.type,
    })

    let finalPrompt = ''

    switch (mode) {
      case 'room':
        finalPrompt =
          prompt ||
          'Transform this room into a modern luxury interior, high detail, realistic lighting, premium furniture'
        break

      case 'face':
        finalPrompt =
          prompt ||
          'Realistic face transformation, natural skin texture, high detail portrait, cinematic lighting'
        break

      case 'property':
        finalPrompt =
          prompt ||
          'Luxury house exterior renovation, modern architecture, realistic, high value property look'
        break

      case 'body':
        finalPrompt =
          prompt ||
          'Fitness transformation, muscular physique, realistic human anatomy, high detail'
        break

      default:
        finalPrompt = prompt || 'High quality realistic transformation'
    }
    // ✅ Correct API call
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: finalPrompt || "Make this image more modern, realistic, high quality",
      size: "1024x1024",
    })

    // ✅ Safe access
    const imageBase64 = response.data?.[0]?.b64_json

    if (!imageBase64) {
      throw new Error('No image returned from OpenAI')
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
    })

  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      { error: error.message || 'AI generation failed' },
      { status: 500 }
    )
  }
}