function initLucideIcons() {
  if (!window.lucide || typeof window.lucide.createIcons !== 'function') return

  const faToLucide = {
    'square-o': 'square',
    'angle-left': 'chevron-left',
    'angle-right': 'chevron-right',
    'telegram-plane': 'send'
  }

  for (const element of document.querySelectorAll('i.fa, i.fas, i.far, i.fal, i.fad, i.fab')) {
    if (!(element instanceof HTMLElement)) continue
    if (element.hasAttribute('data-lucide')) continue

    let faName = null
    for (const className of Array.from(element.classList)) {
      if (className.startsWith('fa-')) {
        faName = className.slice(3)
        break
      }
    }

    if (!faName) continue
    const lucideName = faToLucide[faName]
    if (!lucideName) continue

    for (const className of Array.from(element.classList)) {
      const isFontAwesomeClass =
        className === 'fa' ||
        className === 'fas' ||
        className === 'far' ||
        className === 'fal' ||
        className === 'fad' ||
        className === 'fab' ||
        className.startsWith('fa-')
      if (isFontAwesomeClass) element.classList.remove(className)
    }

    element.setAttribute('data-lucide', lucideName)
  }

  window.lucide.createIcons({
    attrs: {
      width: '1em',
      height: '1em',
      'aria-hidden': 'true'
    }
  })
}

window.addEventListener('DOMContentLoaded', initLucideIcons)
