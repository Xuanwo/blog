// Estimate reading time from plain text. CJK is counted per character
// (~340 chars/min), Latin per word (~220 words/min); the two are summed
// so mixed Chinese/English posts read sensibly. Always at least 1 minute.
const CJK = /[㐀-鿿豈-﫿぀-ヿ]/g

export function readingTime(plain: string): number {
  if (!plain) return 1
  const cjkCount = (plain.match(CJK) || []).length
  const latinCount = plain.replace(CJK, ' ').split(/\s+/).filter(Boolean).length
  const minutes = cjkCount / 340 + latinCount / 220
  return Math.max(1, Math.round(minutes))
}
