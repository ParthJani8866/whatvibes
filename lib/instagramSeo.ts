export type InstagramKeywordEntry = {
  keyword: string
  slug: string
  group: string
}

function normalizeKeyword(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\u2013|\u2014/g, '-').trim()
}

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base.slice(0, 80) || 'keyword'
}

function hashBase36(value: string) {
  // Deterministic, tiny hash (djb2) to avoid slug collisions.
  let hash = 5381
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

function groupForKeyword(keyword: string) {
  const first = keyword.trim().charAt(0).toLowerCase()
  if (first >= 'a' && first <= 'z') return first
  if (first >= '0' && first <= '9') return '0-9'
  return 'other'
}

const seedKeywords = [
  // Username / Name Generator
  'instagram username generator',
  'cool instagram usernames',
  'unique instagram names ideas',
  'instagram name generator with symbols',
  'stylish username for instagram',
  'instagram username checker available',
  'aesthetic usernames for instagram',
  'instagram username ideas for boys',
  'instagram username ideas for girls',
  'rare instagram usernames',

  // Fonts / Stylish Text
  'instagram fonts generator',
  'stylish text for instagram',
  'fancy font generator copy paste',
  'instagram bio fonts copy paste',
  'cool symbols for instagram',
  'instagram stylish name maker',
  'instagram font changer tool',
  'cursive font for instagram bio',
  'fancy letters generator online',
  'instagram symbols copy paste',

  // Captions
  'instagram captions for boys',
  'instagram captions for girls',
  'attitude captions for instagram',
  'short instagram captions',
  'instagram captions for reels',
  'funny instagram captions',
  'love captions for instagram',
  'sad captions for instagram',
  'instagram captions in hindi',
  'trending captions for instagram',

  // Hashtags
  'instagram hashtags generator',
  'trending hashtags for instagram',
  'viral hashtags for reels',
  'best hashtags for likes instagram',
  'instagram hashtags for reels',
  'hashtags for instagram growth',
  'instagram hashtag finder tool',
  'niche hashtags for instagram',
  'hashtags for business instagram',
  'instagram hashtags 2026',

  // AI Tools
  'ai instagram caption generator',
  'ai instagram hashtag generator',
  'ai instagram post generator',
  'ai reels caption generator',
  'instagram content generator ai',

  // Growth + Tools
  'instagram engagement calculator',
  'instagram fake follower checker',
  'instagram dp downloader',
  'instagram reels downloader',
  'instagram story viewer anonymous',

  // Bio / Profile (core cluster)
  'instagram bio generator',
  'instagram bio ideas',
  'best instagram bio for boys',
  'best instagram bio for girls',
  'instagram bio for business',
  'instagram bio with emojis',
  'short instagram bio',
  'cool instagram bio',
  'instagram bio copy paste',
  'instagram profile bio generator',
] as const

const modifiers = [
  'free',
  'online',
  'tool',
  'generator',
  'copy paste',
  'no login',
  '2026',
  '2025',
  'new',
  'best',
  'trending',
  'for reels',
  'for stories',
  'for boys',
  'for girls',
  'for business',
  'in hindi',
  'in english',
  'with symbols',
  'with emojis',
  'aesthetic',
  'attitude',
  'cool',
  'unique',
  'short',
  'simple',
  'stylish',
  'professional',
  'viral',
] as const

const nicheTopics = [
  'travel',
  'fitness',
  'photography',
  'food',
  'fashion',
  'makeup',
  'gaming',
  'business',
  'shop',
  'music',
  'dance',
  'motivation',
  'quotes',
  'memes',
  'nature',
  'cars',
  'books',
  'art',
  'design',
  'sports',
] as const

function generateKeywordsTargetCount(targetCount: number) {
  const list: string[] = []
  const seen = new Set<string>()

  const push = (value: string) => {
    if (list.length >= targetCount) return
    const normalized = normalizeKeyword(value)
    const key = normalized.toLowerCase()
    if (!normalized) return
    if (seen.has(key)) return
    seen.add(key)
    list.push(normalized)
  }

  // 1) Seeds (user-provided + core)
  seedKeywords.forEach((k) => push(k))

  // 2) Modifier combinations (safe, deterministic)
  for (const k of seedKeywords) {
    for (const m of modifiers) {
      push(`${k} ${m}`)
      if (list.length >= targetCount) break
    }
    if (list.length >= targetCount) break
  }

  // 3) Topic expansions (captures lots of long-tail intent)
  const topicTemplates = [
    (topic: string) => `instagram hashtags for ${topic}`,
    (topic: string) => `instagram captions for ${topic}`,
    (topic: string) => `instagram bio for ${topic}`,
    (topic: string) => `${topic} instagram hashtags`,
    (topic: string) => `${topic} instagram captions`,
    (topic: string) => `${topic} instagram bio`,
  ]

  for (const topic of nicheTopics) {
    for (const make of topicTemplates) {
      push(make(topic))
      if (list.length >= targetCount) break
    }
    if (list.length >= targetCount) break
  }

  // 4) Fill to target with cross-combos
  for (const topic of nicheTopics) {
    for (const m of modifiers) {
      push(`instagram hashtags ${m} ${topic}`)
      push(`instagram captions ${m} ${topic}`)
      if (list.length >= targetCount) break
    }
    if (list.length >= targetCount) break
  }

  return list
}

const TARGET_KEYWORD_COUNT = 3200
const generatedKeywords = generateKeywordsTargetCount(TARGET_KEYWORD_COUNT)

const keywordEntries: InstagramKeywordEntry[] = (() => {
  const usedSlugs = new Set<string>()
  const entries: InstagramKeywordEntry[] = []

  for (const keyword of generatedKeywords) {
    let slug = slugify(keyword)
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${hashBase36(keyword).slice(0, 6)}`
    }
    usedSlugs.add(slug)
    entries.push({ keyword, slug, group: groupForKeyword(keyword) })
  }

  return entries
})()

const slugToKeyword = new Map<string, InstagramKeywordEntry>(
  keywordEntries.map((e) => [e.slug, e])
)

export const instagramKeywordCount = keywordEntries.length

export function getInstagramKeywordEntries() {
  return keywordEntries
}

export function getInstagramKeywordEntryBySlug(slug: string) {
  return slugToKeyword.get(slug) ?? null
}

export const instagramKeywordBrowseGroups = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0-9',
] as const

export const instagramToolRoutes = [
  '/instagram-bio-generator',
  '/instagram-fonts-generator',
  '/instagram-username-generator',
  '/instagram-hashtags-generator',
  '/trending-instagram-hashtags',
  '/instagram-captions-for-boys',
  '/instagram-captions-for-girls',
  '/ai-instagram-caption-generator',
  '/instagram-keywords',
] as const
