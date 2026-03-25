'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [mode, setMode] = useState('room')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resultVisible, setResultVisible] = useState(false)

  const modeOptions: Record<string, Array<{ icon: string; name: string }>> = {
    Room: [
      { icon: 'ðŸ›‹ï¸', name: 'Full Renovation' },
      { icon: 'ðŸŒ¿', name: 'Biophilic Design' },
    ],
    Face: [
      { icon: 'ðŸ•', name: '10 Years Later' },
      { icon: 'ðŸ’„', name: 'Glam Makeover' },
    ],
  }

  // Add FAQ structured data for rich results
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does WhatVibes AI transformation work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WhatVibes uses advanced artificial intelligence to analyze your uploaded photo and generate realistic transformations. Simply select your mode (Room or Face), upload an image, and our AI instantly creates a stunning before/after result."
          }
        },
        {
          "@type": "Question",
          "name": "What types of transformations can I create?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can transform rooms with Full Renovation or Biophilic Design styles, or transform faces with 10 Years Later aging effects or Glam Makeover enhancements. More styles coming soon!"
          }
        },
        {
          "@type": "Question",
          "name": "Is WhatVibes free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! WhatVibes offers free AI transformations with no hidden costs. Upload your images and generate professional before/after results instantly."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We support JPG, PNG, and WEBP formats. For best results, use clear, well-lit photos with faces facing forward or rooms with good visibility."
          }
        },
        {
          "@type": "Question",
          "name": "How long does the AI transformation take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Transformations typically complete within 10-30 seconds, depending on image complexity and server load. You'll see your before/after comparison immediately."
          }
        }
      ]
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setGeneratedImage(null)
    setResultVisible(false)
  }

  const generate = async () => {
    if (!file) {
      alert('Please upload image first')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('mode', mode)

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.image) {
        setGeneratedImage(data.image)
        setResultVisible(true)
      } else {
        alert(data.error || 'Failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error')
    }

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>WhatVibes | AI Image Transformation Tool - Before & After Generator</title>
        <meta name="description" content="Transform any room or face with AI-powered before/after transformations. Upload your photo and see stunning renovations, makeovers, and age progression in seconds. Free AI image transformation tool." />
        <meta name="keywords" content="AI transformation, before after generator, room renovation AI, face makeover AI, biophilic design, age progression, glam makeover, interior design AI, photo transformation, virtual renovation, AI makeover tool, whatvibes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="WhatVibes - AI Image Transformation Tool" />
        <meta property="og:description" content="Transform any room or face with AI-powered before/after transformations. Upload your photo and see stunning results instantly." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://whatvibes.com" />
      </Head>

      <main className="bg-[#0a0a0a] text-white min-h-screen">

        {/* HEADER */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-neutral-800 backdrop-blur">
          <h1 className="text-3xl font-bold tracking-wider">
            <span className="text-orange-500">What</span>Vibes
          </h1>
          <span className="bg-orange-500 px-3 py-1 text-xs rounded-full animate-pulse">
            âœ¦ VIRAL TOOL
          </span>
        </header>

        {/* HERO */}
        <section className="text-center py-16 px-4">
          <h1 className="text-[70px] leading-none font-extrabold tracking-tight">
            SEE  
            <span className="text-orange-500 ml-4">TRANSFORMATION</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Upload any photo and generate stunning before/after results with our advanced AI transformation technology
          </p>
        </section>

        {/* MODE */}
        <div className="flex gap-3 justify-center mb-10 flex-wrap">
          {Object.keys(modeOptions).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-xl border ${
                mode === m
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-neutral-700 bg-neutral-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* UPLOAD */}
        <div className="max-w-xl mx-auto px-4">
          <div
            className="border-2 border-dashed border-neutral-700 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-500 transition"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            {!preview ? (
              <>
                <p className="text-xl mb-2">ðŸ“¸ Upload Image</p>
                <p className="text-sm text-gray-400">JPG, PNG, WEBP (Max 10MB)</p>
              </>
            ) : (
              <img
                src={preview}
                alt="Uploaded preview image for AI transformation"
                className="w-full h-72 object-cover rounded-xl"
              />
            )}
          </div>

          <input
            type="file"
            id="fileInput"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0])
            }}
          />
        </div>

        {/* BUTTON */}
        <div className="max-w-xl mx-auto mt-6 px-4">
          <button
            onClick={generate}
            className="w-full py-5 text-xl rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] transition font-semibold"
          >
            âœ¦ GENERATE TRANSFORMATION âœ¦
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 gap-4">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm tracking-widest">
              TRANSFORMING...
            </p>
          </div>
        )}

        {/* RESULT */}
        {resultVisible && (
          <div className="max-w-5xl mx-auto mt-14 px-4">

            <div className="grid grid-cols-2 border border-neutral-800 rounded-2xl overflow-hidden">

              {/* BEFORE */}
              <div className="border-r border-neutral-800">
                <div className="bg-neutral-900 text-gray-400 text-xs px-4 py-2 tracking-widest">
                  â—€ BEFORE
                </div>
                {preview && (
                  <img
                    src={preview}
                    alt="Original uploaded image before AI transformation"
                    className="w-full h-[400px] object-cover"
                  />
                )}
              </div>

              {/* AFTER */}
              <div>
                <div className="bg-orange-500/10 text-orange-500 text-xs px-4 py-2 tracking-widest">
                  AFTER â–¶
                </div>

                {generatedImage ? (
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt="AI generated after transformation result"
                      className="w-full h-[400px] object-cover"
                    />

                    <span className="absolute bottom-3 right-3 bg-orange-500 text-xs px-3 py-1 rounded-full">
                      âœ¦ WhatVibes
                    </span>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center bg-neutral-900">
                    âœ¨ AI Result
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* SEO RICH CONTENT - FEATURES & FAQ */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          
          {/* Features Section - Keyword Rich */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered <span className="text-orange-500">Before & After</span> Transformations
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              WhatVibes uses cutting-edge artificial intelligence to transform your photos in seconds. 
              Whether you&apos;re planning a home renovation, curious about aging effects, or want to see a glam makeover, 
              our AI delivers professional results instantly.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
              <div className="text-3xl mb-3">ðŸ </div>
              <h3 className="text-xl font-semibold mb-2">Room Transformations</h3>
              <p className="text-gray-400 text-sm">Full renovation and biophilic design styles for interior spaces, virtual staging, and home makeovers.</p>
            </div>
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
              <div className="text-3xl mb-3">ðŸ‘¤</div>
              <h3 className="text-xl font-semibold mb-2">Face Transformations</h3>
              <p className="text-gray-400 text-sm">Age progression and glam makeover effects for portraits, social media content, and creative projects.</p>
            </div>
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
              <div className="text-3xl mb-3">âš¡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-400 text-sm">Generate transformations in seconds with our optimized AI pipeline. No waiting, no complicated software.</p>
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="border-t border-neutral-800 pt-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">How does WhatVibes AI transformation work?</h3>
                <p className="text-gray-400">Our AI model analyzes your uploaded image and applies the selected transformation style. For rooms, it understands spatial layout and design elements. For faces, it detects facial features and applies realistic aging or makeup effects. The result is a seamless before/after comparison.</p>
              </div>
              
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">What types of transformations can I create?</h3>
                <p className="text-gray-400">Currently, WhatVibes offers Room transformations (Full Renovation and Biophilic Design) and Face transformations (10 Years Later and Glam Makeover). We&apos;re constantly adding new styles, so check back for updates!</p>
              </div>
              
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">Is WhatVibes free to use?</h3>
                <p className="text-gray-400">Yes! WhatVibes is completely free to use. There are no hidden fees, subscriptions, or watermarks on your generated images. We believe in making AI transformation accessible to everyone.</p>
              </div>
              
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">What image formats are supported?</h3>
                <p className="text-gray-400">We support JPG, PNG, and WEBP formats. For best results, use high-quality images with good lighting. For face transformations, ensure the face is clearly visible and facing forward. For room transformations, well-lit spaces with minimal clutter work best.</p>
              </div>
              
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">How long does the AI transformation take?</h3>
                <p className="text-gray-400">Most transformations complete within 10-30 seconds. Processing time depends on image size and server load. Once complete, you&apos;ll see your before/after comparison instantly.</p>
              </div>
              
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">Is my data private and secure?</h3>
                <p className="text-gray-400">Yes, we prioritize your privacy. Uploaded images are processed temporarily and automatically deleted after transformation. We never store or share your photos. Your transformations remain yours alone.</p>
              </div>
              
              <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold mb-2">Can I use WhatVibes for commercial projects?</h3>
                <p className="text-gray-400">Absolutely! You can use your transformed images for personal or commercial projects. However, please note that the AI model is for creative enhancement and may not be suitable for critical applications like medical or legal use.</p>
              </div>
            </div>
          </div>

          {/* Additional SEO Text Block */}
          <div className="mt-16 text-center text-gray-500 text-sm border-t border-neutral-800 pt-8">
            <p>WhatVibes AI Transformation Tool | Room Renovation AI | Face Makeover Generator | Before After Photo Editor | Virtual Staging AI | Age Progression Tool | Biophilic Design Generator | AI Home Renovation | Portrait Makeover AI</p>
            <p className="mt-2">Â© 2025 WhatVibes - Transform Your World with AI</p>
          </div>
        </div>

      </main>
    </>
  )
}

