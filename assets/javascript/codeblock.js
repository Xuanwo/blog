function normalizeCodeText(text) {
  return text.replace(/\n$/, '')
}

function setTemporaryButtonIcon(button, iconName, durationMs) {
  const original = button.dataset.originalIcon ?? ''
  button.dataset.originalIcon = original
  renderIcon(button, iconName)

  window.setTimeout(() => {
    renderIcon(button, button.dataset.originalIcon ?? original)
  }, durationMs)
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  document.body.appendChild(textarea)

  textarea.focus()
  textarea.select()
  const ok = document.execCommand('copy')
  textarea.remove()

  if (!ok) throw new Error('copy failed')
}

function hasSoftWrapEnabled(codeElement) {
  const ws = window.getComputedStyle(codeElement).whiteSpace
  return ws === 'pre-wrap' || ws === 'break-spaces'
}

function renderIcon(button, iconName) {
  button.replaceChildren()

  const placeholder = document.createElement('i')
  placeholder.setAttribute('data-lucide', iconName)
  button.appendChild(placeholder)

  if (window.lucide?.createIcons) {
    window.lucide.createIcons({
      root: button,
      attrs: {
        width: '1em',
        height: '1em',
        'aria-hidden': 'true'
      }
    })
    return
  }

  placeholder.textContent = iconName
}

function enhanceCodeBlock(preElement) {
  if (!(preElement instanceof HTMLElement)) return
  if (preElement.dataset.codeblockEnhanced === 'true') return

  const codeElement = preElement.querySelector('code')
  if (!codeElement) return

  const wrapper = document.createElement('div')
  wrapper.className = 'codeblock'

  const parent = preElement.parentNode
  if (!parent) return
  parent.insertBefore(wrapper, preElement)
  wrapper.appendChild(preElement)

  const toolbar = document.createElement('div')
  toolbar.className = 'codeblock-toolbar'

  const copyButton = document.createElement('button')
  copyButton.type = 'button'
  copyButton.className = 'codeblock-btn'
  copyButton.dataset.originalIcon = 'copy'
  renderIcon(copyButton, 'copy')
  copyButton.setAttribute('aria-label', 'Copy code to clipboard')
  copyButton.setAttribute('title', 'Copy')

  copyButton.addEventListener('click', async () => {
    try {
      const text = normalizeCodeText(codeElement.textContent ?? '')
      await copyToClipboard(text)
      setTemporaryButtonIcon(copyButton, 'check', 1200)
    } catch {
      setTemporaryButtonIcon(copyButton, 'x', 1500)
    }
  })

  const wrapButton = document.createElement('button')
  wrapButton.type = 'button'
  wrapButton.className = 'codeblock-btn'
  wrapButton.setAttribute('aria-label', 'Toggle soft wrap')
  wrapButton.dataset.originalIcon = 'wrap-text'
  renderIcon(wrapButton, 'wrap-text')

  const updateWrapButton = () => {
    const wrapped = wrapper.classList.contains('is-wrapped')
    wrapButton.setAttribute('aria-pressed', wrapped ? 'true' : 'false')
    wrapButton.setAttribute('title', wrapped ? 'Disable soft wrap' : 'Enable soft wrap')
    wrapButton.classList.toggle('is-active', wrapped)
  }

  const initialWrap = hasSoftWrapEnabled(codeElement)
  wrapper.classList.toggle('is-wrapped', initialWrap)
  wrapper.classList.toggle('is-unwrapped', !initialWrap)
  updateWrapButton()

  wrapButton.addEventListener('click', () => {
    const nextWrapped = !wrapper.classList.contains('is-wrapped')
    wrapper.classList.toggle('is-wrapped', nextWrapped)
    wrapper.classList.toggle('is-unwrapped', !nextWrapped)
    updateWrapButton()
  })

  toolbar.appendChild(copyButton)
  toolbar.appendChild(wrapButton)
  wrapper.appendChild(toolbar)

  preElement.dataset.codeblockEnhanced = 'true'
}

function enhanceAllCodeBlocks() {
  const root = document.querySelector('.post-content')
  if (!root) return

  for (const pre of root.querySelectorAll('pre')) {
    if (pre.closest('.codeblock')) continue
    enhanceCodeBlock(pre)
  }
}

window.addEventListener('DOMContentLoaded', enhanceAllCodeBlocks)
