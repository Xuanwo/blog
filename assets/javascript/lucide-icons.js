import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Send,
  Square,
  WrapText,
  X,
  createIcons
} from 'lucide'

const icons = {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Send,
  Square,
  WrapText,
  X
}

export function createSiteIcons (options = {}) {
  createIcons({
    ...options,
    icons
  })
}
