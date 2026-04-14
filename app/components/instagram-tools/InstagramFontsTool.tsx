'use client'

import { useMemo, useState } from 'react'

type StyleKey =
  | 'bold'
  | 'italic'
  | 'monospace'
  | 'script'
  | 'doublestruck'
  | 'fraktur'
  | 'smallcaps'

const STYLE_LABELS: Record<StyleKey, string> = {
  bold: 'Bold',
  italic: 'Italic',
  monospace: 'Monospace',
  script: 'Script',
  doublestruck: 'Double',
  fraktur: 'Fraktur',
  smallcaps: 'Small Caps',
}

const latinUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const latinLower = 'abcdefghijklmnopqrstuvwxyz'
const digits = '0123456789'

function makeMap(from: string, to: string) {
  const map = new Map<string, string>()
  const fromChars = Array.from(from)
  const toChars = Array.from(to)

  for (let i = 0; i < fromChars.length; i += 1) {
    map.set(fromChars[i]!, toChars[i] ?? fromChars[i]!)
  }

  return map
}

const maps: Record<StyleKey, Map<string, string>> = {
  bold: new Map([
    ...makeMap(latinUpper, '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'),
    ...makeMap(latinLower, '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇'),
    ...makeMap(digits, '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'),
  ]),
  italic: new Map([
    ...makeMap(latinUpper, '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍'),
    ...makeMap(latinLower, '𝑎𝑏𝑐𝑑𝑒𝑓𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'),
  ]),
  monospace: new Map([
    ...makeMap(latinUpper, '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'),
    ...makeMap(latinLower, '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'),
    ...makeMap(digits, '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'),
  ]),
  script: new Map([
    ...makeMap(latinUpper, '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'),
    ...makeMap(latinLower, '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝓄𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'),
  ]),
  doublestruck: new Map([
    ...makeMap(latinUpper, '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'),
    ...makeMap(latinLower, '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'),
    ...makeMap(digits, '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'),
  ]),
  fraktur: new Map([
    ...makeMap(latinUpper, '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ'),
    ...makeMap(latinLower, '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'),
  ]),
  smallcaps: new Map([
    ...makeMap(latinUpper, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    ...makeMap(latinLower, 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'),
  ]),
}

function transformText(text: string, style: StyleKey) {
  const map = maps[style]
  let out = ''
  for (const ch of text) out += map.get(ch) ?? ch
  return out
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export default function InstagramFontsTool() {
  const [text, setText] = useState('Type here…')

  const items = useMemo(() => {
    const keys = Object.keys(STYLE_LABELS) as StyleKey[]
    return keys.map((k) => ({
      key: k,
      label: STYLE_LABELS[k],
      value: transformText(text, k),
    }))
  }, [text])

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-neutral-900">Text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
          placeholder="Type your name, bio, or caption"
        />
      </div>

      <div className="grid gap-3">
        {items.map((it) => (
          <div
            key={it.key}
            className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-900">{it.label}</div>
              <button
                type="button"
                onClick={() => copyToClipboard(it.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-100"
              >
                Copy
              </button>
            </div>
            <div className="break-words text-base text-neutral-900">{it.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="text-sm font-semibold text-neutral-900">Popular symbols (copy/paste)</div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {['•', '×', '★', '✦', '✧', '✿', '☾', '☀', '➜', '✔', '⚡', '♡', '➤', '∞', '✈'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => copyToClipboard(s)}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 hover:bg-neutral-100"
              aria-label={`Copy symbol ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

