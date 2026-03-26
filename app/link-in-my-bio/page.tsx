// app/link-in-my-bio/page.tsx
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import {
  getUserLinksByEmail,
  upsertUserLinksByEmail,
  isPublicIdAvailable,
} from '@/lib/userLinks'
import AuthButtons from '@/app/components/AuthButtons'
import {
  Camera,
  User,
  FileText,
  Tag,
  Heart,
  ShoppingBag,
  Globe,
  ArrowRight,
  X,
} from 'lucide-react'
import {
  FaInstagramSquare,
  FaYoutubeSquare,
  FaLinkedin,
  FaFacebookSquare,
  FaTwitterSquare,
  FaPinterest,
  FaGithub,
} from 'react-icons/fa'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Complete Your Profile | Bio For IG',
  description:
    'Set up your link-in-bio page with your banner, bio, hobbies, and all your social links.',
}

async function saveFile(file: File, prefix: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
  fs.writeFileSync(path.join(uploadDir, filename), buffer)
  return `/uploads/${filename}`
}

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: { edit?: string; error?: string; taken?: string }
}) {
  const session = await getAuthSession()
  const email = session?.user?.email
  if (!email) redirect('/')

  const existingProfile = await getUserLinksByEmail(email)
  const isEditing = searchParams.edit === 'true'

  if (!isEditing && existingProfile?.bio) redirect('/')

  const error = searchParams.error
  const takenId = searchParams.taken

  async function saveProfile(formData: FormData) {
    'use server'
    const session = await getAuthSession()
    const email = session?.user?.email
    if (!email) throw new Error('Unauthorized')

    const publicId = String(formData.get('publicId') ?? '').trim()
    if (!publicId)
      return redirect('/link-in-my-bio?edit=' + (isEditing ? 'true' : '') + '&error=required')
    if (!/^[a-zA-Z0-9_-]+$/.test(publicId))
      return redirect('/link-in-my-bio?edit=' + (isEditing ? 'true' : '') + '&error=invalid')

    const available = await isPublicIdAvailable(publicId)
    if (!available) {
      const current = await getUserLinksByEmail(email)
      if (current?.publicId !== publicId)
        return redirect(
          '/link-in-my-bio?edit=' +
            (isEditing ? 'true' : '') +
            '&error=taken&taken=' +
            encodeURIComponent(publicId)
        )
    }

    const bannerUrl = String(formData.get('banner') ?? '')
    const profilePicUrl = String(formData.get('profilePic') ?? '')
    const bio = String(formData.get('bio') ?? '')
    const hobbies = String(formData.get('hobbies') ?? '')
    const categories = String(formData.get('categories') ?? '')
    const bannerFile = formData.get('bannerFile') as File | null
    const profilePicFile = formData.get('profilePicFile') as File | null

    let finalBanner = bannerUrl
    let finalProfilePic = profilePicUrl
    if (bannerFile && bannerFile.size > 0) {
      const saved = await saveFile(bannerFile, 'banner')
      if (saved) finalBanner = saved
    }
    if (profilePicFile && profilePicFile.size > 0) {
      const saved = await saveFile(profilePicFile, 'avatar')
      if (saved) finalProfilePic = saved
    }

    const hobbiesArray = hobbies.split(',').map((h) => h.trim()).filter(Boolean)
    const categoriesArray = categories.split(',').map((c) => c.trim()).filter(Boolean)
    const existing = await getUserLinksByEmail(email)
    const existingLinks = existing?.links ?? {}

    const nextLinks = {
      ...existingLinks,
      pinterest: String(formData.get('pinterest') ?? ''),
      shopify: String(formData.get('shopify') ?? ''),
      github: String(formData.get('github') ?? ''),
      website: String(formData.get('website') ?? ''),
      youtube: String(formData.get('youtube') ?? existingLinks.youtube ?? ''),
      instagram: String(formData.get('instagram') ?? existingLinks.instagram ?? ''),
      linkedin: String(formData.get('linkedin') ?? existingLinks.linkedin ?? ''),
      facebook: String(formData.get('facebook') ?? existingLinks.facebook ?? ''),
      x: String(formData.get('x') ?? existingLinks.x ?? ''),
    }

    await upsertUserLinksByEmail({
      email,
      name: session.user?.name ?? null,
      image: session.user?.image ?? null,
      links: nextLinks,
      banner: finalBanner,
      profilePic: finalProfilePic,
      bio,
      hobbies: hobbiesArray,
      categories: categoriesArray,
      publicId,
    })

    redirect('/')
  }

  const existingLinks = existingProfile?.links ?? {}
  const prefill = {
    publicId: existingProfile?.publicId ?? '',
    banner: existingProfile?.banner ?? '',
    profilePic: existingProfile?.profilePic ?? session.user?.image ?? '',
    bio: existingProfile?.bio ?? '',
    hobbies: existingProfile?.hobbies ? (existingProfile.hobbies as string[]).join(', ') : '',
    categories: existingProfile?.categories ? (existingProfile.categories as string[]).join(', ') : '',
    instagram: existingLinks.instagram ?? '',
    youtube: existingLinks.youtube ?? '',
    linkedin: existingLinks.linkedin ?? '',
    facebook: existingLinks.facebook ?? '',
    x: existingLinks.x ?? '',
    pinterest: existingLinks.pinterest ?? '',
    shopify: existingLinks.shopify ?? '',
    github: existingLinks.github ?? '',
    website: existingLinks.website ?? '',
  }

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <main className="page-root">
        {/* Aurora orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="noise-overlay" />

        <div className="page-content">
          {/* ── Header ── */}
          <header className="page-header">
            <div className="logo-mark">
              <span>BIG</span>
            </div>
            <h1 className="logo-name">Bio For IG</h1>
            <div className="header-right">
              <AuthButtons signedIn={true} />
            </div>
          </header>

          {/* ── Form card ── */}
          <div className="form-card">
            {/* Card glow border */}
            <div className="card-glow" />

            <div className="card-inner">
              {/* Title */}
              <div className="form-title-block">
                <div className="form-step-badge">
                  {isEditing ? 'Edit Mode' : 'Step 1 of 1'}
                </div>
                <h2 className="form-title">
                  {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
                </h2>
                <p className="form-subtitle">
                  {isEditing
                    ? 'Update your banner, bio, and social links below.'
                    : 'Customize your link-in-bio page to make it uniquely yours.'}
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="error-banner">
                  <span className="error-icon">⚠</span>
                  <span>
                    {error === 'required' && 'Please choose a public username.'}
                    {error === 'invalid' &&
                      'Username can only contain letters, numbers, hyphens, and underscores.'}
                    {error === 'taken' &&
                      `"${takenId}" is already taken. Please choose another username.`}
                  </span>
                </div>
              )}

              <form action={saveProfile} className="profile-form" encType="multipart/form-data">

                {/* ── Section: Identity ── */}
                <div className="form-section">
                  <div className="section-label">
                    <Globe className="section-icon" />
                    <span>Public URL</span>
                  </div>
                  <div className="url-field-row">
                    <span className="url-prefix">
                      {process.env.NEXT_PUBLIC_SITE_URL}/u/
                    </span>
                    <input
                      name="publicId"
                      placeholder="your-username"
                      defaultValue={prefill.publicId}
                      className="dark-input url-input"
                    />
                  </div>
                  <p className="field-hint">Letters, numbers, hyphens, underscores only.</p>
                </div>

                {/* ── Section: Media ── */}
                <div className="form-section">
                  <div className="section-label">
                    <Camera className="section-icon" />
                    <span>Banner Image</span>
                  </div>
                  <div className="media-row">
                    <label className="file-upload-btn">
                      <input name="bannerFile" type="file" accept="image/*" className="sr-only" />
                      <Camera size={14} />
                      Upload file
                    </label>
                    <span className="or-divider">or</span>
                    <input
                      name="banner"
                      type="url"
                      placeholder="https://example.com/banner.jpg"
                      defaultValue={prefill.banner}
                      className="dark-input flex-1"
                    />
                  </div>
                  {prefill.banner && (
                    <div className="img-preview banner-preview">
                      <img src={prefill.banner} alt="Banner preview" />
                      <span className="img-preview-label">Current banner</span>
                    </div>
                  )}
                  <p className="field-hint">Recommended: 1500×500px.</p>
                </div>

                <div className="form-section">
                  <div className="section-label">
                    <User className="section-icon" />
                    <span>Profile Picture</span>
                  </div>
                  <div className="media-row">
                    <label className="file-upload-btn">
                      <input name="profilePicFile" type="file" accept="image/*" className="sr-only" />
                      <User size={14} />
                      Upload file
                    </label>
                    <span className="or-divider">or</span>
                    <input
                      name="profilePic"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      defaultValue={prefill.profilePic}
                      className="dark-input flex-1"
                    />
                  </div>
                  {prefill.profilePic && (
                    <div className="img-preview avatar-preview">
                      <img src={prefill.profilePic} alt="Profile preview" />
                      <span className="img-preview-label">Current picture</span>
                    </div>
                  )}
                  <p className="field-hint">Leave blank to use your Google profile picture.</p>
                </div>

                {/* ── Section: About ── */}
                <div className="form-section">
                  <div className="section-label">
                    <FileText className="section-icon" />
                    <span>Bio</span>
                  </div>
                  <textarea
                    name="bio"
                    rows={3}
                    placeholder="Tell your audience about yourself..."
                    defaultValue={prefill.bio}
                    className="dark-input dark-textarea"
                  />
                </div>

                <div className="two-col">
                  <div className="form-section">
                    <div className="section-label">
                      <Heart className="section-icon" />
                      <span>Hobbies</span>
                    </div>
                    <input
                      name="hobbies"
                      placeholder="Photography, Travel, Coding"
                      defaultValue={prefill.hobbies}
                      className="dark-input"
                    />
                    <p className="field-hint">Comma-separated.</p>
                  </div>

                  <div className="form-section">
                    <div className="section-label">
                      <Tag className="section-icon" />
                      <span>Categories</span>
                    </div>
                    <input
                      name="categories"
                      placeholder="Creator, Entrepreneur"
                      defaultValue={prefill.categories}
                      className="dark-input"
                    />
                    <p className="field-hint">Comma-separated.</p>
                  </div>
                </div>

                {/* ── Section: Social Links ── */}
                <div className="socials-section">
                  <div className="socials-header">
                    <span className="socials-title">Social Links</span>
                    <span className="socials-badge">Connect your platforms</span>
                  </div>

                  <div className="socials-grid">
                    {/* Instagram */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)' }}>
                          <FaInstagramSquare size={13} />
                        </span>
                        Instagram
                      </label>
                      <input name="instagram" placeholder="@username or URL" defaultValue={prefill.instagram} className="dark-input social-input" />
                    </div>

                    {/* YouTube */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#FF0000,#cc0000)' }}>
                          <FaYoutubeSquare size={13} />
                        </span>
                        YouTube
                      </label>
                      <input name="youtube" placeholder="@channel or URL" defaultValue={prefill.youtube} className="dark-input social-input" />
                    </div>

                    {/* LinkedIn */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#0077B5,#005fa3)' }}>
                          <FaLinkedin size={13} />
                        </span>
                        LinkedIn
                      </label>
                      <input name="linkedin" placeholder="/in/username or URL" defaultValue={prefill.linkedin} className="dark-input social-input" />
                    </div>

                    {/* Facebook */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#1877F2,#0c5fd8)' }}>
                          <FaFacebookSquare size={13} />
                        </span>
                        Facebook
                      </label>
                      <input name="facebook" placeholder="/username or URL" defaultValue={prefill.facebook} className="dark-input social-input" />
                    </div>

                    {/* X */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#14171A,#2b2b2b)' }}>
                          <FaTwitterSquare size={13} />
                        </span>
                        X / Twitter
                      </label>
                      <input name="x" placeholder="@username or URL" defaultValue={prefill.x} className="dark-input social-input" />
                    </div>

                    {/* Pinterest */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#E60023,#ad081b)' }}>
                          <FaPinterest size={13} />
                        </span>
                        Pinterest
                      </label>
                      <input name="pinterest" placeholder="/username or URL" defaultValue={prefill.pinterest} className="dark-input social-input" />
                    </div>

                    {/* Shopify */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#96bf48,#5e8e3e)' }}>
                          <ShoppingBag size={13} />
                        </span>
                        Shopify
                      </label>
                      <input name="shopify" placeholder="https://yourstore.myshopify.com" defaultValue={prefill.shopify} className="dark-input social-input" />
                    </div>

                    {/* GitHub */}
                    <div className="social-field">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#24292e,#444d56)' }}>
                          <FaGithub size={13} />
                        </span>
                        GitHub
                      </label>
                      <input name="github" placeholder="https://github.com/username" defaultValue={prefill.github} className="dark-input social-input" />
                    </div>

                    {/* Website — full width */}
                    <div className="social-field social-field--wide">
                      <label className="social-label">
                        <span className="social-icon-wrap" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          <Globe size={13} />
                        </span>
                        Personal Website
                      </label>
                      <input name="website" placeholder="https://yourwebsite.com" defaultValue={prefill.website} className="dark-input social-input" />
                    </div>
                  </div>
                </div>

                {/* ── Submit ── */}
                <button type="submit" className="submit-btn">
                  <span>{isEditing ? 'Update Profile' : 'Save & Continue'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {isEditing && (
                <div className="cancel-row">
                  <Link href="/" className="cancel-link">
                    <X size={13} />
                    Cancel
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="page-footer">
            Powered by <span>Bio For IG</span>
          </footer>
        </div>
      </main>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────────────────────────── */
const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Root ── */
  .page-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080b14;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Aurora orbs ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
    animation: drift 20s ease-in-out infinite alternate;
  }
  .orb-1 {
    width: 650px; height: 650px;
    top: -220px; left: -220px;
    background: radial-gradient(circle, rgba(99,102,241,.32) 0%, transparent 70%);
    animation-delay: 0s;
  }
  .orb-2 {
    width: 500px; height: 500px;
    bottom: -160px; right: -160px;
    background: radial-gradient(circle, rgba(236,72,153,.28) 0%, transparent 70%);
    animation-delay: -8s;
  }
  .orb-3 {
    width: 420px; height: 420px;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(56,189,248,.16) 0%, transparent 70%);
    animation-delay: -14s;
  }
  @keyframes drift {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(40px, -30px) scale(1.05); }
    66%  { transform: translate(-22px, 38px) scale(0.97); }
    100% { transform: translate(28px, 18px) scale(1.03); }
  }

  /* noise */
  .noise-overlay {
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1; opacity: 0.55;
  }

  /* ── Page layout ── */
  .page-content {
    position: relative;
    z-index: 2;
    max-width: 780px;
    margin: 0 auto;
    padding: 28px 20px 60px;
    animation: fadein .4s ease both;
  }
  @keyframes fadein {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .page-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }
  .logo-mark {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: grid;
    place-items: center;
    font-family: 'Syne', sans-serif;
    font-size: .65rem;
    font-weight: 800;
    color: white;
    letter-spacing: .05em;
    box-shadow: 0 4px 16px rgba(99,102,241,.4);
  }
  .logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -.01em;
    flex: 1;
  }
  .header-right { margin-left: auto; }

  /* ── Form card ── */
  .form-card {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
  }
  .card-glow {
    position: absolute; inset: 0;
    border-radius: 28px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(99,102,241,.35), rgba(168,85,247,.2), rgba(236,72,153,.2));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .card-inner {
    background: rgba(255,255,255,.04);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 28px;
    padding: 36px 36px 40px;
  }
  @media (max-width: 600px) {
    .card-inner { padding: 24px 20px 32px; }
  }

  /* ── Form title ── */
  .form-title-block { margin-bottom: 28px; }
  .form-step-badge {
    display: inline-block;
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #a5b4fc;
    background: rgba(99,102,241,.15);
    border: 1px solid rgba(99,102,241,.3);
    padding: 4px 12px;
    border-radius: 99px;
    margin-bottom: 12px;
  }
  .form-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -.025em;
    line-height: 1.1;
  }
  .form-subtitle {
    margin-top: 8px;
    color: rgba(255,255,255,.45);
    font-size: .9rem;
    line-height: 1.6;
  }

  /* ── Error banner ── */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(239,68,68,.12);
    border: 1px solid rgba(239,68,68,.3);
    color: #fca5a5;
    padding: 12px 16px;
    border-radius: 14px;
    font-size: .85rem;
    margin-bottom: 24px;
  }
  .error-icon { font-size: 1rem; flex-shrink: 0; }

  /* ── Form sections ── */
  .profile-form { display: flex; flex-direction: column; gap: 24px; }
  .form-section { display: flex; flex-direction: column; gap: 8px; }

  .section-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: .8rem;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: rgba(255,255,255,.55);
  }
  .section-icon {
    width: 14px; height: 14px;
    color: #818cf8;
    flex-shrink: 0;
  }

  .field-hint {
    font-size: .75rem;
    color: rgba(255,255,255,.28);
    line-height: 1.4;
  }

  /* ── Inputs ── */
  .dark-input {
    width: 100%;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    padding: 11px 16px;
    font-size: .875rem;
    font-family: 'DM Sans', sans-serif;
    color: #e2e8f0;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    -webkit-appearance: none;
  }
  .dark-input::placeholder { color: rgba(255,255,255,.22); }
  .dark-input:focus {
    border-color: rgba(99,102,241,.7);
    background: rgba(99,102,241,.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }
  .dark-textarea { resize: none; }

  /* URL field */
  .url-field-row {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color .2s, box-shadow .2s;
  }
  .url-field-row:focus-within {
    border-color: rgba(99,102,241,.7);
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }
  .url-prefix {
    padding: 11px 12px 11px 16px;
    font-size: .8rem;
    color: rgba(255,255,255,.35);
    white-space: nowrap;
    border-right: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.03);
    flex-shrink: 0;
  }
  .url-input {
    flex: 1;
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  /* ── Media row ── */
  .media-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .file-upload-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 16px;
    border-radius: 12px;
    background: rgba(99,102,241,.15);
    border: 1px solid rgba(99,102,241,.3);
    color: #a5b4fc;
    font-size: .82rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background .2s, transform .15s;
    font-family: 'DM Sans', sans-serif;
  }
  .file-upload-btn:hover {
    background: rgba(99,102,241,.25);
    transform: translateY(-1px);
  }
  .or-divider {
    font-size: .75rem;
    color: rgba(255,255,255,.25);
    flex-shrink: 0;
  }
  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
  }

  /* Image previews */
  .img-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }
  .banner-preview img {
    height: 60px;
    width: 160px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,.1);
  }
  .avatar-preview img {
    height: 48px; width: 48px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.1);
  }
  .img-preview-label {
    font-size: .72rem;
    color: rgba(255,255,255,.3);
    text-transform: uppercase;
    letter-spacing: .06em;
    font-weight: 600;
  }

  /* ── Two col layout ── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 540px) {
    .two-col { grid-template-columns: 1fr; }
  }

  /* ── Socials section ── */
  .socials-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 20px;
    padding: 22px 22px 24px;
  }
  .socials-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .socials-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -.01em;
  }
  .socials-badge {
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #c4b5fd;
    background: rgba(139,92,246,.15);
    border: 1px solid rgba(139,92,246,.25);
    padding: 3px 10px;
    border-radius: 99px;
  }
  .socials-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 540px) {
    .socials-grid { grid-template-columns: 1fr; }
  }
  .social-field { display: flex; flex-direction: column; gap: 7px; }
  .social-field--wide { grid-column: 1 / -1; }

  .social-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: .78rem;
    font-weight: 600;
    color: rgba(255,255,255,.55);
    letter-spacing: .02em;
    cursor: default;
  }
  .social-icon-wrap {
    width: 24px; height: 24px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
  }
  .social-input {
    font-size: .82rem;
    padding: 9px 14px;
  }

  /* ── Submit button ── */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 15px 24px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: .95rem;
    font-weight: 700;
    letter-spacing: .01em;
    border: none;
    cursor: pointer;
    transition: transform .2s, box-shadow .2s, opacity .2s;
    box-shadow: 0 8px 28px rgba(99,102,241,.35);
    margin-top: 8px;
  }
  .submit-btn:hover {
    transform: translateY(-2px) scale(1.005);
    box-shadow: 0 12px 36px rgba(99,102,241,.5);
  }
  .submit-btn:active {
    transform: translateY(0) scale(.99);
    opacity: .9;
  }

  /* ── Cancel link ── */
  .cancel-row {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
  .cancel-link {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: .82rem;
    color: rgba(255,255,255,.3);
    text-decoration: none;
    transition: color .2s;
  }
  .cancel-link:hover { color: rgba(255,255,255,.6); }

  /* ── Footer ── */
  .page-footer {
    margin-top: 28px;
    text-align: center;
    font-size: .7rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.18);
  }
  .page-footer span {
    color: rgba(255,255,255,.38);
    font-weight: 600;
  }
`