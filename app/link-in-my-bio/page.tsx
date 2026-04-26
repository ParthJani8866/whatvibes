// app/link-in-my-bio/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Import icons from lucide-react (only available ones)
import {
  Camera,
  User,
  FileText,
  Tag,
  Heart,
  ShoppingBag,
  Globe,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Check,
  AlertCircle,
  Loader2,
  Link2,
  Music,
  Video,
  MessageCircle,
  Pin,
  Share2,
} from 'lucide-react'

// Import social icons from react-icons
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook, FaGithub, FaPinterest, FaTiktok, FaTwitch, FaDiscord } from 'react-icons/fa'

// Type definitions
type SocialPlatform = {
  id: string
  name: string
  icon: React.ReactNode
  placeholder: string
  color: string
  enabled: boolean
  value: string
}

type CustomLink = {
  id: string
  title: string
  url: string
  icon: string
}

type ProfileData = {
  publicId: string
  banner: string
  profilePic: string
  bio: string
  hobbies: string[]
  categories: string[]
  socials: SocialPlatform[]
  customLinks: CustomLink[]
}

// Sortable social link item
function SortableSocialItem({
  platform,
  onUpdate,
  onToggle,
  onRemove,
}: {
  platform: SocialPlatform
  onUpdate: (id: string, value: string) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: platform.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border ${platform.enabled ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50/50'} transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 transition"
        >
          <GripVertical size={18} />
        </div>

        {/* Icon with color */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          style={{ background: platform.color }}
        >
          {platform.icon}
        </div>

        {/* Input */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-neutral-700">{platform.name}</span>
            <button
              onClick={() => onToggle(platform.id)}
              className={`text-xs px-2 py-0.5 rounded-full transition ${
                platform.enabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {platform.enabled ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <input
            type="text"
            value={platform.value}
            onChange={(e) => onUpdate(platform.id, e.target.value)}
            placeholder={platform.placeholder}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(platform.id)}
          className="shrink-0 rounded-lg p-2 text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

// Sortable custom link item
function SortableCustomLinkItem({
  link,
  onUpdate,
  onRemove,
}: {
  link: CustomLink
  onUpdate: (id: string, field: 'title' | 'url', value: string) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-all hover:shadow-md"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600"
      >
        <GripVertical size={18} />
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={link.title}
          onChange={(e) => onUpdate(link.id, 'title', e.target.value)}
          placeholder="Link title (e.g., My Blog)"
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="url"
          value={link.url}
          onChange={(e) => onUpdate(link.id, 'url', e.target.value)}
          placeholder="https://example.com"
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <button
        onClick={() => onRemove(link.id)}
        className="shrink-0 rounded-lg p-2 text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

// Live Preview Component
function LivePreview({ data, sessionEmail }: { data: ProfileData; sessionEmail: string }) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const enabledSocials = data.socials.filter(s => s.enabled && s.value.trim())

  return (
    <div className="sticky top-6 rounded-2xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
        {data.banner && !imageErrors[data.banner] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.banner}
            alt="Banner"
            className="h-full w-full object-cover"
            onError={() => setImageErrors(prev => ({ ...prev, [data.banner]: true }))}
          />
        )}
      </div>

      {/* Profile Picture */}
      <div className="relative px-6">
        <div className="absolute -top-12 left-6">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-neutral-100 shadow-md">
            {data.profilePic && !imageErrors[data.profilePic] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.profilePic}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={() => setImageErrors(prev => ({ ...prev, [data.profilePic]: true }))}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <User size={32} className="text-indigo-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-14 px-6 pb-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">@{data.publicId || 'username'}</h3>
            <p className="text-sm text-neutral-500">{sessionEmail}</p>
          </div>
        </div>

        {data.bio && (
          <p className="mb-4 text-sm text-neutral-600 leading-relaxed">{data.bio}</p>
        )}

        {/* Hobbies */}
        {data.hobbies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {data.hobbies.map((hobby) => (
              <span key={hobby} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                {hobby}
              </span>
            ))}
          </div>
        )}

        {/* Categories */}
        {data.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {data.categories.map((cat) => (
              <span key={cat} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className="space-y-2">
          {enabledSocials.map((social) => (
            <a
              key={social.id}
              href={social.value.startsWith('http') ? social.value : `https://${social.id}.com/${social.value.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:scale-[1.02] hover:border-neutral-300 hover:shadow-md"
              style={{ borderLeft: `3px solid ${social.color.split(',')[0] || '#6366f1'}` }}
            >
              <span className="text-base">{social.icon}</span>
              {social.name}
            </a>
          ))}

          {data.customLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:scale-[1.02] hover:border-neutral-300 hover:shadow-md"
            >
              <Link2 size={16} />
              {link.title || link.url.replace(/^https?:\/\//, '').slice(0, 30)}
            </a>
          ))}
        </div>

        {enabledSocials.length === 0 && data.customLinks.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            Add links below to see them here
          </div>
        )}
      </div>
    </div>
  )
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionEmail, setSessionEmail] = useState('')

  // Form data
  const [profileData, setProfileData] = useState<ProfileData>({
    publicId: '',
    banner: '',
    profilePic: '',
    bio: '',
    hobbies: [],
    categories: [],
    socials: [
      { id: 'instagram', name: 'Instagram', icon: <FaInstagram size={16} />, placeholder: '@username or URL', color: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', enabled: true, value: '' },
      { id: 'youtube', name: 'YouTube', icon: <FaYoutube size={16} />, placeholder: '@channel or URL', color: '#FF0000', enabled: true, value: '' },
      { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin size={16} />, placeholder: '/in/username or URL', color: '#0077B5', enabled: true, value: '' },
      { id: 'facebook', name: 'Facebook', icon: <FaFacebook size={16} />, placeholder: '/username or URL', color: '#1877F2', enabled: true, value: '' },
      { id: 'pinterest', name: 'Pinterest', icon: <FaPinterest size={16} />, placeholder: '/username or URL', color: '#E60023', enabled: true, value: '' },
      { id: 'shopify', name: 'Shopify', icon: <ShoppingBag size={14} />, placeholder: 'store.myshopify.com', color: '#96bf48', enabled: true, value: '' },
      { id: 'github', name: 'GitHub', icon: <FaGithub size={16} />, placeholder: 'username or URL', color: '#24292e', enabled: true, value: '' },
      { id: 'tiktok', name: 'TikTok', icon: <FaTiktok size={16} />, placeholder: '@username or URL', color: '#000000', enabled: true, value: '' },
      { id: 'twitch', name: 'Twitch', icon: <FaTwitch size={16} />, placeholder: '/username or URL', color: '#9146FF', enabled: true, value: '' },
      { id: 'discord', name: 'Discord', icon: <FaDiscord size={16} />, placeholder: 'invite URL', color: '#5865F2', enabled: true, value: '' },
    ],
    customLinks: [],
  })

  // New custom link form
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  // File upload refs
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setProfileData({
              publicId: data.publicId || '',
              banner: data.banner || '',
              profilePic: data.profilePic || '',
              bio: data.bio || '',
              hobbies: data.hobbies || [],
              categories: data.categories || [],
              socials: profileData.socials.map(s => ({
                ...s,
                value: data.links?.[s.id] || '',
              })),
              customLinks: data.customLinks || [],
            })
            if (data.email) setSessionEmail(data.email)
          }
        }
        
        // Get session email
        const sessionRes = await fetch('/api/session')
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()
          if (sessionData.email) setSessionEmail(sessionData.email)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Auto-hide saved indicator
  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  // Drag end handler for socials
  const handleSocialDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = profileData.socials.findIndex((s) => s.id === active.id)
      const newIndex = profileData.socials.findIndex((s) => s.id === over?.id)
      setProfileData(prev => ({
        ...prev,
        socials: arrayMove(prev.socials, oldIndex, newIndex),
      }))
    }
  }

  // Drag end handler for custom links
  const handleCustomLinkDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = profileData.customLinks.findIndex((l) => l.id === active.id)
      const newIndex = profileData.customLinks.findIndex((l) => l.id === over?.id)
      setProfileData(prev => ({
        ...prev,
        customLinks: arrayMove(prev.customLinks, oldIndex, newIndex),
      }))
    }
  }

  // Social handlers
  const updateSocialValue = (id: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === id ? { ...s, value } : s),
    }))
  }

  const toggleSocialEnabled = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s),
    }))
  }

  const removeSocial = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      socials: prev.socials.filter(s => s.id !== id),
    }))
  }

  // Custom link handlers
  const addCustomLink = () => {
    if (!newLinkTitle.trim() && !newLinkUrl.trim()) return
    setProfileData(prev => ({
      ...prev,
      customLinks: [
        ...prev.customLinks,
        {
          id: `custom-${Date.now()}-${Math.random()}`,
          title: newLinkTitle.trim() || 'Untitled',
          url: newLinkUrl.trim(),
          icon: 'link',
        },
      ],
    }))
    setNewLinkTitle('')
    setNewLinkUrl('')
  }

  const updateCustomLink = (id: string, field: 'title' | 'url', value: string) => {
    setProfileData(prev => ({
      ...prev,
      customLinks: prev.customLinks.map(l => l.id === id ? { ...l, [field]: value } : l),
    }))
  }

  const removeCustomLink = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter(l => l.id !== id),
    }))
  }

  // File upload handlers
  const uploadFile = async (file: File, type: 'banner' | 'avatar'): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const data = await res.json()
      return data.url
    }
    return null
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const url = await uploadFile(file, 'banner')
    if (url) setProfileData(prev => ({ ...prev, banner: url }))
    setLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const url = await uploadFile(file, 'avatar')
    if (url) setProfileData(prev => ({ ...prev, profilePic: url }))
    setLoading(false)
  }

  // Save profile
  const saveProfile = async () => {
    if (!profileData.publicId.trim()) {
      setError('Please choose a public username')
      return
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(profileData.publicId)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: profileData.publicId,
          banner: profileData.banner,
          profilePic: profileData.profilePic,
          bio: profileData.bio,
          hobbies: profileData.hobbies,
          categories: profileData.categories,
          links: Object.fromEntries(profileData.socials.map(s => [s.id, s.value])),
          customLinks: profileData.customLinks,
        }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        const errorData = await res.json()
        setError(errorData.message || 'Failed to save profile')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (loading && !profileData.publicId && !profileData.bio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md transition group-hover:scale-105">
              <span className="text-xs font-black">B</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Bio For IG</h1>
              <p className="text-xs text-neutral-500">Customize your link in bio page</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 animate-in fade-in slide-in-from-right-2">
                <Check size={12} /> Saved
              </span>
            )}
            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Publish Changes'}
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Two column layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Public URL */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Globe size={16} /> Your unique URL
              </label>
              <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <span className="px-3 text-sm text-neutral-500">bioforig.com/u/</span>
                <input
                  type="text"
                  value={profileData.publicId}
                  onChange={(e) => setProfileData(prev => ({ ...prev, publicId: e.target.value }))}
                  placeholder="your-username"
                  className="flex-1 rounded-r-xl border-0 bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-400">Letters, numbers, hyphens, underscores only</p>
            </div>

            {/* Images */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Media</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Camera size={14} /> Banner Image
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => bannerInputRef.current?.click()}
                      className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                    >
                      Upload Banner
                    </button>
                    <input
                      type="text"
                      value={profileData.banner}
                      onChange={(e) => setProfileData(prev => ({ ...prev, banner: e.target.value }))}
                      placeholder="https:// or /uploads/..."
                      className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <User size={14} /> Profile Picture
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                    >
                      Upload Avatar
                    </button>
                    <input
                      type="text"
                      value={profileData.profilePic}
                      onChange={(e) => setProfileData(prev => ({ ...prev, profilePic: e.target.value }))}
                      placeholder="https:// or /uploads/..."
                      className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <FileText size={16} /> Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                placeholder="Tell your audience about yourself..."
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Hobbies & Categories */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Heart size={16} /> Hobbies
                </label>
                <input
                  type="text"
                  value={profileData.hobbies.join(', ')}
                  onChange={(e) => setProfileData(prev => ({ ...prev, hobbies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="Photography, Travel, Coding"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
                <p className="mt-2 text-xs text-neutral-400">Comma-separated</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Tag size={16} /> Categories
                </label>
                <input
                  type="text"
                  value={profileData.categories.join(', ')}
                  onChange={(e) => setProfileData(prev => ({ ...prev, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="Creator, Entrepreneur, Artist"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
                <p className="mt-2 text-xs text-neutral-400">Comma-separated</p>
              </div>
            </div>

            {/* Social Links - Sortable */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Social Links</h3>
                <span className="text-xs text-neutral-400">Drag to reorder</span>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSocialDragEnd}>
                <SortableContext items={profileData.socials.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {profileData.socials.map((platform) => (
                      <SortableSocialItem
                        key={platform.id}
                        platform={platform}
                        onUpdate={updateSocialValue}
                        onToggle={toggleSocialEnabled}
                        onRemove={removeSocial}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add new social button */}
              <button
                onClick={() => {
                  const newId = `social-${Date.now()}`
                  setProfileData(prev => ({
                    ...prev,
                    socials: [
                      ...prev.socials,
                      {
                        id: newId,
                        name: 'New Link',
                        icon: <Share2 size={14} />,
                        placeholder: 'https://...',
                        color: '#6366f1',
                        enabled: true,
                        value: '',
                      },
                    ],
                  }))
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-500 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <Plus size={16} /> Add custom social link
              </button>
            </div>

            {/* Custom Links - Sortable */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Custom Links</h3>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCustomLinkDragEnd}>
                <SortableContext items={profileData.customLinks.map(l => l.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {profileData.customLinks.map((link) => (
                      <SortableCustomLinkItem
                        key={link.id}
                        link={link}
                        onUpdate={updateCustomLink}
                        onRemove={removeCustomLink}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add new custom link */}
              <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="Link title (e.g., My Portfolio)"
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
                <button
                  onClick={addCustomLink}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
                >
                  <Plus size={14} /> Add Custom Link
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div>
            <LivePreview data={profileData} sessionEmail={sessionEmail || 'user@example.com'} />
            <p className="mt-3 text-center text-xs text-neutral-400">
              Live preview updates as you type
            </p>
          </div>
        </div>

        {/* Bottom Save Bar (mobile) */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/80 backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <span className="text-sm text-neutral-500">Unsaved changes</span>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}