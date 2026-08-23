// Convert a rendered docs article (#main-doc) back into Markdown, client-side.
// Used by the page actions for "Copy Page" and "View as Markdown".
export function articleToMarkdown(root: HTMLElement): string {
  const out: string[] = []

  const inline = (el: Node): string => {
    let s = ''
    el.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        s += n.textContent ?? ''
      } else if (n instanceof HTMLElement) {
        const t = n.tagName
        if (t === 'A') s += `[${inline(n)}](${n.getAttribute('href') ?? ''})`
        else if (t === 'CODE') s += '`' + (n.textContent ?? '') + '`'
        else if (t === 'STRONG' || t === 'B') s += `**${inline(n)}**`
        else if (t === 'EM' || t === 'I') s += `*${inline(n)}*`
        else if (t === 'BR') s += '\n'
        else s += inline(n)
      }
    })
    return s
  }

  const block = (el: HTMLElement) => {
    const tag = el.tagName
    if (tag === 'BUTTON' || tag === 'SVG' || tag === 'STYLE') return

    if (/^H[1-6]$/.test(tag)) {
      const level = Number(tag[1])
      out.push(`${'#'.repeat(level)} ${el.textContent?.trim() ?? ''}`, '')
    } else if (tag === 'P') {
      out.push(inline(el).trim(), '')
    } else if (tag === 'UL' || tag === 'OL') {
      const ordered = tag === 'OL'
      Array.from(el.children).forEach((li, i) => {
        out.push(`${ordered ? `${i + 1}.` : '-'} ${inline(li as HTMLElement).trim()}`)
      })
      out.push('')
    } else if (tag === 'PRE') {
      const code = el.querySelector('code')
      const lang = code?.className.match(/language-(\w+)/)?.[1] ?? ''
      const text = (code?.textContent ?? el.textContent ?? '').replace(/\n+$/, '')
      out.push('```' + lang, text, '```', '')
    } else if (tag === 'BLOCKQUOTE') {
      inline(el)
        .trim()
        .split('\n')
        .forEach((l) => out.push(`> ${l}`))
      out.push('')
    } else if (tag === 'TABLE') {
      Array.from(el.querySelectorAll('tr')).forEach((tr, ri) => {
        const cells = Array.from(tr.children).map((c) => inline(c as HTMLElement).trim())
        out.push(`| ${cells.join(' | ')} |`)
        if (ri === 0) out.push(`| ${cells.map(() => '---').join(' | ')} |`)
      })
      out.push('')
    } else if (tag === 'HR') {
      out.push('---', '')
    } else {
      // Unknown wrapper (e.g. the code-block div): recurse into its children.
      Array.from(el.children).forEach((c) => block(c as HTMLElement))
    }
  }

  Array.from(root.children).forEach((c) => block(c as HTMLElement))
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
