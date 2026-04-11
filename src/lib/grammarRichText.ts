const COLOR_CLASS_MAP: Record<string, string> = {
  red: 'text-red-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  gray: 'text-gray-600',
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function applyMarkdown(input: string): string {
  return input
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
}

function parseCustomTokens(input: string): string {
  let output = input

  output = output.replace(
    /\{(red|blue|green|yellow|orange|purple|gray)\}([\s\S]*?)\{\/\1\}/g,
    (_, color: string, content: string) =>
      `<span class="${COLOR_CLASS_MAP[color]}">${parseCustomTokens(content)}</span>`,
  )

  output = output.replace(
    /\{u\}([\s\S]*?)\{\/u\}/g,
    (_, content: string) => `<u>${parseCustomTokens(content)}</u>`,
  )

  return applyMarkdown(output)
}

export function toGrammarRichTextHtml(input: string): string {
  const escaped = escapeHtml(input)
  const parsed = parseCustomTokens(escaped)
  return parsed.replace(/\r?\n/g, '<br />')
}
