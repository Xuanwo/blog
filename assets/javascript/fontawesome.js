(function () {
  'use strict'

  function _typeof (obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof = function (obj) {
        return typeof obj
      }
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
      }
    }

    return _typeof(obj)
  }

  function _classCallCheck (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }

  function _defineProperties (target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  function _createClass (Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
    if (staticProps) _defineProperties(Constructor, staticProps)
    return Constructor
  }

  function _defineProperty (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      })
    } else {
      obj[key] = value
    }

    return obj
  }

  function _objectSpread (target) {
    for (let i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {}
      let ownKeys = Object.keys(source)

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable
        }))
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key])
      })
    }

    return target
  }

  function _slicedToArray (arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  }

  function _toConsumableArray (arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  }

  function _arrayWithoutHoles (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]

      return arr2
    }
  }

  function _arrayWithHoles (arr) {
    if (Array.isArray(arr)) return arr
  }

  function _iterableToArray (iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]') return Array.from(iter)
  }

  function _iterableToArrayLimit (arr, i) {
    const _arr = []
    let _n = true
    let _d = false
    let _e

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value)

        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      try {
        if (!_n && _i.return != null) _i.return()
      } finally {
        if (_d) throw _e
      }
    }

    return _arr
  }

  function _nonIterableSpread () {
    throw new TypeError('Invalid attempt to spread non-iterable instance')
  }

  function _nonIterableRest () {
    throw new TypeError('Invalid attempt to destructure non-iterable instance')
  }

  const noop = function noop () {
  }

  let _WINDOW = {}
  let _DOCUMENT = {}
  let _MUTATION_OBSERVER = null
  let _PERFORMANCE = {
    mark: noop,
    measure: noop
  }

  try {
    if (typeof window !== 'undefined') _WINDOW = window
    if (typeof document !== 'undefined') _DOCUMENT = document
    if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver
    if (typeof performance !== 'undefined') _PERFORMANCE = performance
  } catch (e) {
  }

  const _ref = _WINDOW.navigator || {}
  const _ref$userAgent = _ref.userAgent
  const userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent

  const WINDOW = _WINDOW
  const DOCUMENT = _DOCUMENT
  const MUTATION_OBSERVER = _MUTATION_OBSERVER
  const PERFORMANCE = _PERFORMANCE
  const IS_BROWSER = !!WINDOW.document
  const IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function'
  const IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/')

  const NAMESPACE_IDENTIFIER = '___FONT_AWESOME___'
  const UNITS_IN_GRID = 16
  const DEFAULT_FAMILY_PREFIX = 'fa'
  const DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa'
  const DATA_FA_I2SVG = 'data-fa-i2svg'
  const DATA_FA_PSEUDO_ELEMENT = 'data-fa-pseudo-element'
  const DATA_FA_PSEUDO_ELEMENT_PENDING = 'data-fa-pseudo-element-pending'
  const DATA_PREFIX = 'data-prefix'
  const DATA_ICON = 'data-icon'
  const HTML_CLASS_I2SVG_BASE_CLASS = 'fontawesome-i2svg'
  const MUTATION_APPROACH_ASYNC = 'async'
  const TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ['HTML', 'HEAD', 'STYLE', 'SCRIPT']
  const PRODUCTION = (function () {
    try {
      return 'production' === 'production'
    } catch (e) {
      return false
    }
  }())
  const PREFIX_TO_STYLE = {
    fas: 'solid',
    far: 'regular',
    fal: 'light',
    fad: 'duotone',
    fab: 'brands',
    fa: 'solid'
  }
  const STYLE_TO_PREFIX = {
    solid: 'fas',
    regular: 'far',
    light: 'fal',
    duotone: 'fad',
    brands: 'fab'
  }
  const LAYERS_TEXT_CLASSNAME = 'fa-layers-text'
  const FONT_FAMILY_PATTERN = /Font Awesome 5 (Solid|Regular|Light|Duotone|Brands|Free|Pro)/
  const FONT_WEIGHT_TO_PREFIX = {
    900: 'fas',
    400: 'far',
    normal: 'far',
    300: 'fal'
  }
  const oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  const ATTRIBUTES_WATCHED_FOR_MUTATION = ['class', 'data-prefix', 'data-icon', 'data-fa-transform', 'data-fa-mask']
  const DUOTONE_CLASSES = {
    GROUP: 'group',
    SWAP_OPACITY: 'swap-opacity',
    PRIMARY: 'primary',
    SECONDARY: 'secondary'
  }
  const RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'flip-both', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter', DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY].concat(oneToTen.map(function (n) {
    return ''.concat(n, 'x')
  })).concat(oneToTwenty.map(function (n) {
    return 'w-'.concat(n)
  }))

  const initial = WINDOW.FontAwesomeConfig || {}

  function getAttrConfig (attr) {
    const element = DOCUMENT.querySelector('script[' + attr + ']')

    if (element) {
      return element.getAttribute(attr)
    }
  }

  function coerce (val) {
    // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
    // We'll assume that this is an indication that it should be toggled to true
    // For example <script data-search-pseudo-elements src="..."></script>
    if (val === '') return true
    if (val === 'false') return false
    if (val === 'true') return true
    return val
  }

  if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
    const attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']]
    attrs.forEach(function (_ref) {
      const _ref2 = _slicedToArray(_ref, 2)
      const attr = _ref2[0]
      const key = _ref2[1]

      const val = coerce(getAttrConfig(attr))

      if (val !== undefined && val !== null) {
        initial[key] = val
      }
    })
  }

  const _default = {
    familyPrefix: DEFAULT_FAMILY_PREFIX,
    replacementClass: DEFAULT_REPLACEMENT_CLASS,
    autoReplaceSvg: true,
    autoAddCss: true,
    autoA11y: true,
    searchPseudoElements: false,
    observeMutations: true,
    mutateApproach: 'async',
    keepOriginalSource: true,
    measurePerformance: false,
    showMissingIcons: true
  }

  const _config = _objectSpread({}, _default, initial)

  if (!_config.autoReplaceSvg) _config.observeMutations = false

  const config = _objectSpread({}, _config)

  WINDOW.FontAwesomeConfig = config

  const w = WINDOW || {}
  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {}
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {}
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {}
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = []
  const namespace = w[NAMESPACE_IDENTIFIER]

  const functions = []

  const listener = function listener () {
    DOCUMENT.removeEventListener('DOMContentLoaded', listener)
    loaded = 1
    functions.map(function (fn) {
      return fn()
    })
  }

  var loaded = false

  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState)
    if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener)
  }

  function domready (fn) {
    if (!IS_DOM) return
    loaded ? setTimeout(fn, 0) : functions.push(fn)
  }

  const PENDING = 'pending'
  const SETTLED = 'settled'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'

  const NOOP = function NOOP () {
  }

  const isNode = typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function'
  const asyncSetTimer = typeof setImmediate === 'undefined' ? setTimeout : setImmediate
  let asyncQueue = []
  let asyncTimer

  function asyncFlush () {
    // run promise callbacks
    for (let i = 0; i < asyncQueue.length; i++) {
      asyncQueue[i][0](asyncQueue[i][1])
    } // reset async asyncQueue

    asyncQueue = []
    asyncTimer = false
  }

  function asyncCall (callback, arg) {
    asyncQueue.push([callback, arg])

    if (!asyncTimer) {
      asyncTimer = true
      asyncSetTimer(asyncFlush, 0)
    }
  }

  function invokeResolver (resolver, promise) {
    function resolvePromise (value) {
      resolve(promise, value)
    }

    function rejectPromise (reason) {
      reject(promise, reason)
    }

    try {
      resolver(resolvePromise, rejectPromise)
    } catch (e) {
      rejectPromise(e)
    }
  }

  function invokeCallback (subscriber) {
    const owner = subscriber.owner
    let settled = owner._state
    let value = owner._data
    const callback = subscriber[settled]
    const promise = subscriber.then

    if (typeof callback === 'function') {
      settled = FULFILLED

      try {
        value = callback(value)
      } catch (e) {
        reject(promise, e)
      }
    }

    if (!handleThenable(promise, value)) {
      if (settled === FULFILLED) {
        resolve(promise, value)
      }

      if (settled === REJECTED) {
        reject(promise, value)
      }
    }
  }

  function handleThenable (promise, value) {
    let resolved

    try {
      if (promise === value) {
        throw new TypeError('A promises callback cannot return that same promise.')
      }

      if (value && (typeof value === 'function' || _typeof(value) === 'object')) {
        // then should be retrieved only once
        const then = value.then

        if (typeof then === 'function') {
          then.call(value, function (val) {
            if (!resolved) {
              resolved = true

              if (value === val) {
                fulfill(promise, val)
              } else {
                resolve(promise, val)
              }
            }
          }, function (reason) {
            if (!resolved) {
              resolved = true
              reject(promise, reason)
            }
          })
          return true
        }
      }
    } catch (e) {
      if (!resolved) {
        reject(promise, e)
      }

      return true
    }

    return false
  }

  function resolve (promise, value) {
    if (promise === value || !handleThenable(promise, value)) {
      fulfill(promise, value)
    }
  }

  function fulfill (promise, value) {
    if (promise._state === PENDING) {
      promise._state = SETTLED
      promise._data = value
      asyncCall(publishFulfillment, promise)
    }
  }

  function reject (promise, reason) {
    if (promise._state === PENDING) {
      promise._state = SETTLED
      promise._data = reason
      asyncCall(publishRejection, promise)
    }
  }

  function publish (promise) {
    promise._then = promise._then.forEach(invokeCallback)
  }

  function publishFulfillment (promise) {
    promise._state = FULFILLED
    publish(promise)
  }

  function publishRejection (promise) {
    promise._state = REJECTED
    publish(promise)

    if (!promise._handled && isNode) {
      global.process.emit('unhandledRejection', promise._data, promise)
    }
  }

  function notifyRejectionHandled (promise) {
    global.process.emit('rejectionHandled', promise)
  }

  /**
     * @class
     */

  function P (resolver) {
    if (typeof resolver !== 'function') {
      throw new TypeError('Promise resolver ' + resolver + ' is not a function')
    }

    if (this instanceof P === false) {
      throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.')
    }

    this._then = []
    invokeResolver(resolver, this)
  }

  P.prototype = {
    constructor: P,
    _state: PENDING,
    _then: null,
    _data: undefined,
    _handled: false,
    then: function then (onFulfillment, onRejection) {
      const subscriber = {
        owner: this,
        then: new this.constructor(NOOP),
        fulfilled: onFulfillment,
        rejected: onRejection
      }

      if ((onRejection || onFulfillment) && !this._handled) {
        this._handled = true

        if (this._state === REJECTED && isNode) {
          asyncCall(notifyRejectionHandled, this)
        }
      }

      if (this._state === FULFILLED || this._state === REJECTED) {
        // already resolved, call callback async
        asyncCall(invokeCallback, subscriber)
      } else {
        // subscribe
        this._then.push(subscriber)
      }

      return subscriber.then
    },
    catch: function _catch (onRejection) {
      return this.then(null, onRejection)
    }
  }

  P.all = function (promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('You must pass an array to Promise.all().')
    }

    return new P(function (resolve, reject) {
      const results = []
      let remaining = 0

      function resolver (index) {
        remaining++
        return function (value) {
          results[index] = value

          if (!--remaining) {
            resolve(results)
          }
        }
      }

      for (var i = 0, promise; i < promises.length; i++) {
        promise = promises[i]

        if (promise && typeof promise.then === 'function') {
          promise.then(resolver(i), reject)
        } else {
          results[i] = promise
        }
      }

      if (!remaining) {
        resolve(results)
      }
    })
  }

  P.race = function (promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('You must pass an array to Promise.race().')
    }

    return new P(function (resolve, reject) {
      for (var i = 0, promise; i < promises.length; i++) {
        promise = promises[i]

        if (promise && typeof promise.then === 'function') {
          promise.then(resolve, reject)
        } else {
          resolve(promise)
        }
      }
    })
  }

  P.resolve = function (value) {
    if (value && _typeof(value) === 'object' && value.constructor === P) {
      return value
    }

    return new P(function (resolve) {
      resolve(value)
    })
  }

  P.reject = function (reason) {
    return new P(function (resolve, reject) {
      reject(reason)
    })
  }

  const picked = typeof Promise === 'function' ? Promise : P

  const d = UNITS_IN_GRID
  const meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false
  }

  function isReserved (name) {
    return ~RESERVED_CLASSES.indexOf(name)
  }

  function bunker (fn) {
    try {
      fn()
    } catch (e) {
      if (!PRODUCTION) {
        throw e
      }
    }
  }

  function insertCss (css) {
    if (!css || !IS_DOM) {
      return
    }

    const style = DOCUMENT.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = css
    const headChildren = DOCUMENT.head.childNodes
    let beforeChild = null

    for (let i = headChildren.length - 1; i > -1; i--) {
      const child = headChildren[i]
      const tagName = (child.tagName || '').toUpperCase()

      if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
        beforeChild = child
      }
    }

    DOCUMENT.head.insertBefore(style, beforeChild)
    return css
  }

  const idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  function nextUniqueId () {
    let size = 12
    let id = ''

    while (size-- > 0) {
      id += idPool[Math.random() * 62 | 0]
    }

    return id
  }

  function toArray (obj) {
    const array = []

    for (let i = (obj || []).length >>> 0; i--;) {
      array[i] = obj[i]
    }

    return array
  }

  function classArray (node) {
    if (node.classList) {
      return toArray(node.classList)
    } else {
      return (node.getAttribute('class') || '').split(' ').filter(function (i) {
        return i
      })
    }
  }

  function getIconName (familyPrefix, cls) {
    const parts = cls.split('-')
    const prefix = parts[0]
    const iconName = parts.slice(1).join('-')

    if (prefix === familyPrefix && iconName !== '' && !isReserved(iconName)) {
      return iconName
    } else {
      return null
    }
  }

  function htmlEscape (str) {
    return ''.concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function joinAttributes (attributes) {
    return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
      return acc + ''.concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ')
    }, '').trim()
  }

  function joinStyles (styles) {
    return Object.keys(styles || {}).reduce(function (acc, styleName) {
      return acc + ''.concat(styleName, ': ').concat(styles[styleName], ';')
    }, '')
  }

  function transformIsMeaningful (transform) {
    return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY
  }

  function transformForSvg (_ref) {
    const transform = _ref.transform
    const containerWidth = _ref.containerWidth
    const iconWidth = _ref.iconWidth
    const outer = {
      transform: 'translate('.concat(containerWidth / 2, ' 256)')
    }
    const innerTranslate = 'translate('.concat(transform.x * 32, ', ').concat(transform.y * 32, ') ')
    const innerScale = 'scale('.concat(transform.size / 16 * (transform.flipX ? -1 : 1), ', ').concat(transform.size / 16 * (transform.flipY ? -1 : 1), ') ')
    const innerRotate = 'rotate('.concat(transform.rotate, ' 0 0)')
    const inner = {
      transform: ''.concat(innerTranslate, ' ').concat(innerScale, ' ').concat(innerRotate)
    }
    const path = {
      transform: 'translate('.concat(iconWidth / 2 * -1, ' -256)')
    }
    return {
      outer: outer,
      inner: inner,
      path: path
    }
  }

  function transformForCss (_ref2) {
    const transform = _ref2.transform
    const _ref2$width = _ref2.width
    const width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width
    const _ref2$height = _ref2.height
    const height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height
    const _ref2$startCentered = _ref2.startCentered
    const startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered
    let val = ''

    if (startCentered && IS_IE) {
      val += 'translate('.concat(transform.x / d - width / 2, 'em, ').concat(transform.y / d - height / 2, 'em) ')
    } else if (startCentered) {
      val += 'translate(calc(-50% + '.concat(transform.x / d, 'em), calc(-50% + ').concat(transform.y / d, 'em)) ')
    } else {
      val += 'translate('.concat(transform.x / d, 'em, ').concat(transform.y / d, 'em) ')
    }

    val += 'scale('.concat(transform.size / d * (transform.flipX ? -1 : 1), ', ').concat(transform.size / d * (transform.flipY ? -1 : 1), ') ')
    val += 'rotate('.concat(transform.rotate, 'deg) ')
    return val
  }

  const ALL_SPACE = {
    x: 0,
    y: 0,
    width: '100%',
    height: '100%'
  }

  function fillBlack (abstract) {
    const force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true

    if (abstract.attributes && (abstract.attributes.fill || force)) {
      abstract.attributes.fill = 'black'
    }

    return abstract
  }

  function deGroup (abstract) {
    if (abstract.tag === 'g') {
      return abstract.children
    } else {
      return [abstract]
    }
  }

  function makeIconMasking (_ref) {
    const children = _ref.children
    const attributes = _ref.attributes
    const main = _ref.main
    const mask = _ref.mask
    const explicitMaskId = _ref.maskId
    const transform = _ref.transform
    const mainWidth = main.width
    const mainPath = main.icon
    const maskWidth = mask.width
    const maskPath = mask.icon
    const trans = transformForSvg({
      transform: transform,
      containerWidth: maskWidth,
      iconWidth: mainWidth
    })
    const maskRect = {
      tag: 'rect',
      attributes: _objectSpread({}, ALL_SPACE, {
        fill: 'white'
      })
    }
    const maskInnerGroupChildrenMixin = mainPath.children ? {
      children: mainPath.children.map(fillBlack)
    } : {}
    const maskInnerGroup = {
      tag: 'g',
      attributes: _objectSpread({}, trans.inner),
      children: [fillBlack(_objectSpread({
        tag: mainPath.tag,
        attributes: _objectSpread({}, mainPath.attributes, trans.path)
      }, maskInnerGroupChildrenMixin))]
    }
    const maskOuterGroup = {
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [maskInnerGroup]
    }
    const maskId = 'mask-'.concat(explicitMaskId || nextUniqueId())
    const clipId = 'clip-'.concat(explicitMaskId || nextUniqueId())
    const maskTag = {
      tag: 'mask',
      attributes: _objectSpread({}, ALL_SPACE, {
        id: maskId,
        maskUnits: 'userSpaceOnUse',
        maskContentUnits: 'userSpaceOnUse'
      }),
      children: [maskRect, maskOuterGroup]
    }
    const defs = {
      tag: 'defs',
      children: [{
        tag: 'clipPath',
        attributes: {
          id: clipId
        },
        children: deGroup(maskPath)
      }, maskTag]
    }
    children.push(defs, {
      tag: 'rect',
      attributes: _objectSpread({
        fill: 'currentColor',
        'clip-path': 'url(#'.concat(clipId, ')'),
        mask: 'url(#'.concat(maskId, ')')
      }, ALL_SPACE)
    })
    return {
      children: children,
      attributes: attributes
    }
  }

  function makeIconStandard (_ref) {
    const children = _ref.children
    const attributes = _ref.attributes
    const main = _ref.main
    const transform = _ref.transform
    const styles = _ref.styles
    const styleString = joinStyles(styles)

    if (styleString.length > 0) {
      attributes.style = styleString
    }

    if (transformIsMeaningful(transform)) {
      const trans = transformForSvg({
        transform: transform,
        containerWidth: main.width,
        iconWidth: main.width
      })
      children.push({
        tag: 'g',
        attributes: _objectSpread({}, trans.outer),
        children: [{
          tag: 'g',
          attributes: _objectSpread({}, trans.inner),
          children: [{
            tag: main.icon.tag,
            children: main.icon.children,
            attributes: _objectSpread({}, main.icon.attributes, trans.path)
          }]
        }]
      })
    } else {
      children.push(main.icon)
    }

    return {
      children: children,
      attributes: attributes
    }
  }

  function asIcon (_ref) {
    const children = _ref.children
    const main = _ref.main
    const mask = _ref.mask
    const attributes = _ref.attributes
    const styles = _ref.styles
    const transform = _ref.transform

    if (transformIsMeaningful(transform) && main.found && !mask.found) {
      const width = main.width
      const height = main.height
      const offset = {
        x: width / height / 2,
        y: 0.5
      }
      attributes.style = joinStyles(_objectSpread({}, styles, {
        'transform-origin': ''.concat(offset.x + transform.x / 16, 'em ').concat(offset.y + transform.y / 16, 'em')
      }))
    }

    return [{
      tag: 'svg',
      attributes: attributes,
      children: children
    }]
  }

  function asSymbol (_ref) {
    const prefix = _ref.prefix
    const iconName = _ref.iconName
    const children = _ref.children
    const attributes = _ref.attributes
    const symbol = _ref.symbol
    const id = symbol === true ? ''.concat(prefix, '-').concat(config.familyPrefix, '-').concat(iconName) : symbol
    return [{
      tag: 'svg',
      attributes: {
        style: 'display: none;'
      },
      children: [{
        tag: 'symbol',
        attributes: _objectSpread({}, attributes, {
          id: id
        }),
        children: children
      }]
    }]
  }

  function makeInlineSvgAbstract (params) {
    const _params$icons = params.icons
    const main = _params$icons.main
    const mask = _params$icons.mask
    const prefix = params.prefix
    const iconName = params.iconName
    const transform = params.transform
    const symbol = params.symbol
    const title = params.title
    const maskId = params.maskId
    const titleId = params.titleId
    const extra = params.extra
    const _params$watchable = params.watchable
    const watchable = _params$watchable === void 0 ? false : _params$watchable

    const _ref = mask.found ? mask : main
    const width = _ref.width
    const height = _ref.height

    const widthClass = 'fa-w-'.concat(Math.ceil(width / height * 16))
    const attrClass = [config.replacementClass, iconName ? ''.concat(config.familyPrefix, '-').concat(iconName) : '', widthClass].filter(function (c) {
      return extra.classes.indexOf(c) === -1
    }).concat(extra.classes).join(' ')
    const content = {
      children: [],
      attributes: _objectSpread({}, extra.attributes, {
        'data-prefix': prefix,
        'data-icon': iconName,
        class: attrClass,
        role: extra.attributes.role || 'img',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 '.concat(width, ' ').concat(height)
      })
    }

    if (watchable) {
      content.attributes[DATA_FA_I2SVG] = ''
    }

    if (title) {
      content.children.push({
        tag: 'title',
        attributes: {
          id: content.attributes['aria-labelledby'] || 'title-'.concat(titleId || nextUniqueId())
        },
        children: [title]
      })
    }

    const args = _objectSpread({}, content, {
      prefix: prefix,
      iconName: iconName,
      main: main,
      mask: mask,
      maskId: maskId,
      transform: transform,
      symbol: symbol,
      styles: extra.styles
    })

    const _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args)
    const children = _ref2.children
    const attributes = _ref2.attributes

    args.children = children
    args.attributes = attributes

    if (symbol) {
      return asSymbol(args)
    } else {
      return asIcon(args)
    }
  }

  function makeLayersTextAbstract (params) {
    const content = params.content
    const width = params.width
    const height = params.height
    const transform = params.transform
    const title = params.title
    const extra = params.extra
    const _params$watchable2 = params.watchable
    const watchable = _params$watchable2 === void 0 ? false : _params$watchable2

    const attributes = _objectSpread({}, extra.attributes, title ? {
      title: title
    } : {}, {
      class: extra.classes.join(' ')
    })

    if (watchable) {
      attributes[DATA_FA_I2SVG] = ''
    }

    const styles = _objectSpread({}, extra.styles)

    if (transformIsMeaningful(transform)) {
      styles.transform = transformForCss({
        transform: transform,
        startCentered: true,
        width: width,
        height: height
      })
      styles['-webkit-transform'] = styles.transform
    }

    const styleString = joinStyles(styles)

    if (styleString.length > 0) {
      attributes.style = styleString
    }

    const val = []
    val.push({
      tag: 'span',
      attributes: attributes,
      children: [content]
    })

    if (title) {
      val.push({
        tag: 'span',
        attributes: {
          class: 'sr-only'
        },
        children: [title]
      })
    }

    return val
  }

  function makeLayersCounterAbstract (params) {
    const content = params.content
    const title = params.title
    const extra = params.extra

    const attributes = _objectSpread({}, extra.attributes, title ? {
      title: title
    } : {}, {
      class: extra.classes.join(' ')
    })

    const styleString = joinStyles(extra.styles)

    if (styleString.length > 0) {
      attributes.style = styleString
    }

    const val = []
    val.push({
      tag: 'span',
      attributes: attributes,
      children: [content]
    })

    if (title) {
      val.push({
        tag: 'span',
        attributes: {
          class: 'sr-only'
        },
        children: [title]
      })
    }

    return val
  }

  const noop$1 = function noop () {
  }

  const p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
    mark: noop$1,
    measure: noop$1
  }
  const preamble = 'FA "5.13.0"'

  const begin = function begin (name) {
    p.mark(''.concat(preamble, ' ').concat(name, ' begins'))
    return function () {
      return end(name)
    }
  }

  var end = function end (name) {
    p.mark(''.concat(preamble, ' ').concat(name, ' ends'))
    p.measure(''.concat(preamble, ' ').concat(name), ''.concat(preamble, ' ').concat(name, ' begins'), ''.concat(preamble, ' ').concat(name, ' ends'))
  }

  const perf = {
    begin: begin,
    end: end
  }

  /**
     * Internal helper to bind a function known to have 4 arguments
     * to a given context.
     */

  const bindInternal4 = function bindInternal4 (func, thisContext) {
    return function (a, b, c, d) {
      return func.call(thisContext, a, b, c, d)
    }
  }

  /**
     * # Reduce
     *
     * A fast object `.reduce()` implementation.
     *
     * @param  {Object}   subject      The object to reduce over.
     * @param  {Function} fn           The reducer function.
     * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
     * @param  {Object}   thisContext  The context for the reducer.
     * @return {mixed}                 The final result.
     */

  const reduce = function fastReduceObject (subject, fn, initialValue, thisContext) {
    const keys = Object.keys(subject)
    const length = keys.length
    const iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn
    let i
    let key
    let result

    if (initialValue === undefined) {
      i = 1
      result = subject[keys[0]]
    } else {
      i = 0
      result = initialValue
    }

    for (; i < length; i++) {
      key = keys[i]
      result = iterator(result, subject[key], key, subject)
    }

    return result
  }

  function toHex (unicode) {
    let result = ''

    for (let i = 0; i < unicode.length; i++) {
      const hex = unicode.charCodeAt(i).toString(16)
      result += ('000' + hex).slice(-4)
    }

    return result
  }

  function defineIcons (prefix, icons) {
    const params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
    const _params$skipHooks = params.skipHooks
    const skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks
    const normalized = Object.keys(icons).reduce(function (acc, iconName) {
      const icon = icons[iconName]
      const expanded = !!icon.icon

      if (expanded) {
        acc[icon.iconName] = icon.icon
      } else {
        acc[iconName] = icon
      }

      return acc
    }, {})

    if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
      namespace.hooks.addPack(prefix, normalized)
    } else {
      namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized)
    }
    /**
         * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
         * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
         * for `fas` so we'll easy the upgrade process for our users by automatically defining
         * this as well.
         */

    if (prefix === 'fas') {
      defineIcons('fa', icons)
    }
  }

  const styles = namespace.styles
  const shims = namespace.shims
  let _byUnicode = {}
  let _byLigature = {}
  let _byOldName = {}
  const build = function build () {
    const lookup = function lookup (reducer) {
      return reduce(styles, function (o, style, prefix) {
        o[prefix] = reduce(style, reducer, {})
        return o
      }, {})
    }

    _byUnicode = lookup(function (acc, icon, iconName) {
      if (icon[3]) {
        acc[icon[3]] = iconName
      }

      return acc
    })
    _byLigature = lookup(function (acc, icon, iconName) {
      const ligatures = icon[2]
      acc[iconName] = iconName
      ligatures.forEach(function (ligature) {
        acc[ligature] = iconName
      })
      return acc
    })
    const hasRegular = 'far' in styles
    _byOldName = reduce(shims, function (acc, shim) {
      const oldName = shim[0]
      let prefix = shim[1]
      const iconName = shim[2]

      if (prefix === 'far' && !hasRegular) {
        prefix = 'fas'
      }

      acc[oldName] = {
        prefix: prefix,
        iconName: iconName
      }
      return acc
    }, {})
  }
  build()

  function byUnicode (prefix, unicode) {
    return (_byUnicode[prefix] || {})[unicode]
  }

  function byLigature (prefix, ligature) {
    return (_byLigature[prefix] || {})[ligature]
  }

  function byOldName (name) {
    return _byOldName[name] || {
      prefix: null,
      iconName: null
    }
  }

  const styles$1 = namespace.styles
  const emptyCanonicalIcon = function emptyCanonicalIcon () {
    return {
      prefix: null,
      iconName: null,
      rest: []
    }
  }

  function getCanonicalIcon (values) {
    return values.reduce(function (acc, cls) {
      const iconName = getIconName(config.familyPrefix, cls)

      if (styles$1[cls]) {
        acc.prefix = cls
      } else if (config.autoFetchSvg && ['fas', 'far', 'fal', 'fad', 'fab', 'fa'].indexOf(cls) > -1) {
        acc.prefix = cls
      } else if (iconName) {
        const shim = acc.prefix === 'fa' ? byOldName(iconName) : {}
        acc.iconName = shim.iconName || iconName
        acc.prefix = shim.prefix || acc.prefix
      } else if (cls !== config.replacementClass && cls.indexOf('fa-w-') !== 0) {
        acc.rest.push(cls)
      }

      return acc
    }, emptyCanonicalIcon())
  }

  function iconFromMapping (mapping, prefix, iconName) {
    if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
      return {
        prefix: prefix,
        iconName: iconName,
        icon: mapping[prefix][iconName]
      }
    }
  }

  function toHtml (abstractNodes) {
    const tag = abstractNodes.tag
    const _abstractNodes$attrib = abstractNodes.attributes
    const attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib
    const _abstractNodes$childr = abstractNodes.children
    const children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr

    if (typeof abstractNodes === 'string') {
      return htmlEscape(abstractNodes)
    } else {
      return '<'.concat(tag, ' ').concat(joinAttributes(attributes), '>').concat(children.map(toHtml).join(''), '</').concat(tag, '>')
    }
  }

  const noop$2 = function noop () {
  }

  function isWatched (node) {
    const i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null
    return typeof i2svg === 'string'
  }

  function getMutator () {
    if (config.autoReplaceSvg === true) {
      return mutators.replace
    }

    const mutator = mutators[config.autoReplaceSvg]
    return mutator || mutators.replace
  }

  var mutators = {
    replace: function replace (mutation) {
      const node = mutation[0]
      const abstract = mutation[1]
      const newOuterHTML = abstract.map(function (a) {
        return toHtml(a)
      }).join('\n')

      if (node.parentNode && node.outerHTML) {
        node.outerHTML = newOuterHTML + (config.keepOriginalSource && node.tagName.toLowerCase() !== 'svg' ? '<!-- '.concat(node.outerHTML, ' -->') : '')
      } else if (node.parentNode) {
        const newNode = document.createElement('span')
        node.parentNode.replaceChild(newNode, node)
        newNode.outerHTML = newOuterHTML
      }
    },
    nest: function nest (mutation) {
      const node = mutation[0]
      const abstract = mutation[1] // If we already have a replaced node we do not want to continue nesting within it.
      // Short-circuit to the standard replacement

      if (~classArray(node).indexOf(config.replacementClass)) {
        return mutators.replace(mutation)
      }

      const forSvg = new RegExp(''.concat(config.familyPrefix, '-.*'))
      delete abstract[0].attributes.style
      delete abstract[0].attributes.id
      const splitClasses = abstract[0].attributes.class.split(' ').reduce(function (acc, cls) {
        if (cls === config.replacementClass || cls.match(forSvg)) {
          acc.toSvg.push(cls)
        } else {
          acc.toNode.push(cls)
        }

        return acc
      }, {
        toNode: [],
        toSvg: []
      })
      abstract[0].attributes.class = splitClasses.toSvg.join(' ')
      const newInnerHTML = abstract.map(function (a) {
        return toHtml(a)
      }).join('\n')
      node.setAttribute('class', splitClasses.toNode.join(' '))
      node.setAttribute(DATA_FA_I2SVG, '')
      node.innerHTML = newInnerHTML
    }
  }

  function performOperationSync (op) {
    op()
  }

  function perform (mutations, callback) {
    const callbackFunction = typeof callback === 'function' ? callback : noop$2

    if (mutations.length === 0) {
      callbackFunction()
    } else {
      let frame = performOperationSync

      if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
        frame = WINDOW.requestAnimationFrame || performOperationSync
      }

      frame(function () {
        const mutator = getMutator()
        const mark = perf.begin('mutate')
        mutations.map(mutator)
        mark()
        callbackFunction()
      })
    }
  }

  let disabled = false

  function disableObservation () {
    disabled = true
  }

  function enableObservation () {
    disabled = false
  }

  let mo = null

  function observe (options) {
    if (!MUTATION_OBSERVER) {
      return
    }

    if (!config.observeMutations) {
      return
    }

    const treeCallback = options.treeCallback
    const nodeCallback = options.nodeCallback
    const pseudoElementsCallback = options.pseudoElementsCallback
    const _options$observeMutat = options.observeMutationsRoot
    const observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat
    mo = new MUTATION_OBSERVER(function (objects) {
      if (disabled) return
      toArray(objects).forEach(function (mutationRecord) {
        if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
          if (config.searchPseudoElements) {
            pseudoElementsCallback(mutationRecord.target)
          }

          treeCallback(mutationRecord.target)
        }

        if (mutationRecord.type === 'attributes' && mutationRecord.target.parentNode && config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target.parentNode)
        }

        if (mutationRecord.type === 'attributes' && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
          if (mutationRecord.attributeName === 'class') {
            const _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target))
            const prefix = _getCanonicalIcon.prefix
            const iconName = _getCanonicalIcon.iconName

            if (prefix) mutationRecord.target.setAttribute('data-prefix', prefix)
            if (iconName) mutationRecord.target.setAttribute('data-icon', iconName)
          } else {
            nodeCallback(mutationRecord.target)
          }
        }
      })
    })
    if (!IS_DOM) return
    mo.observe(observeMutationsRoot, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    })
  }

  function disconnect () {
    if (!mo) return
    mo.disconnect()
  }

  function styleParser (node) {
    const style = node.getAttribute('style')
    let val = []

    if (style) {
      val = style.split(';').reduce(function (acc, style) {
        const styles = style.split(':')
        const prop = styles[0]
        const value = styles.slice(1)

        if (prop && value.length > 0) {
          acc[prop] = value.join(':').trim()
        }

        return acc
      }, {})
    }

    return val
  }

  function classParser (node) {
    const existingPrefix = node.getAttribute('data-prefix')
    const existingIconName = node.getAttribute('data-icon')
    const innerText = node.innerText !== undefined ? node.innerText.trim() : ''
    const val = getCanonicalIcon(classArray(node))

    if (existingPrefix && existingIconName) {
      val.prefix = existingPrefix
      val.iconName = existingIconName
    }

    if (val.prefix && innerText.length > 1) {
      val.iconName = byLigature(val.prefix, node.innerText)
    } else if (val.prefix && innerText.length === 1) {
      val.iconName = byUnicode(val.prefix, toHex(node.innerText))
    }

    return val
  }

  const parseTransformString = function parseTransformString (transformString) {
    const transform = {
      size: 16,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      rotate: 0
    }

    if (!transformString) {
      return transform
    } else {
      return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
        const parts = n.toLowerCase().split('-')
        const first = parts[0]
        let rest = parts.slice(1).join('-')

        if (first && rest === 'h') {
          acc.flipX = true
          return acc
        }

        if (first && rest === 'v') {
          acc.flipY = true
          return acc
        }

        rest = parseFloat(rest)

        if (isNaN(rest)) {
          return acc
        }

        switch (first) {
          case 'grow':
            acc.size = acc.size + rest
            break

          case 'shrink':
            acc.size = acc.size - rest
            break

          case 'left':
            acc.x = acc.x - rest
            break

          case 'right':
            acc.x = acc.x + rest
            break

          case 'up':
            acc.y = acc.y - rest
            break

          case 'down':
            acc.y = acc.y + rest
            break

          case 'rotate':
            acc.rotate = acc.rotate + rest
            break
        }

        return acc
      }, transform)
    }
  }

  function transformParser (node) {
    return parseTransformString(node.getAttribute('data-fa-transform'))
  }

  function symbolParser (node) {
    const symbol = node.getAttribute('data-fa-symbol')
    return symbol === null ? false : symbol === '' ? true : symbol
  }

  function attributesParser (node) {
    const extraAttributes = toArray(node.attributes).reduce(function (acc, attr) {
      if (acc.name !== 'class' && acc.name !== 'style') {
        acc[attr.name] = attr.value
      }

      return acc
    }, {})
    const title = node.getAttribute('title')
    const titleId = node.getAttribute('data-fa-title-id')

    if (config.autoA11y) {
      if (title) {
        extraAttributes['aria-labelledby'] = ''.concat(config.replacementClass, '-title-').concat(titleId || nextUniqueId())
      } else {
        extraAttributes['aria-hidden'] = 'true'
        extraAttributes.focusable = 'false'
      }
    }

    return extraAttributes
  }

  function maskParser (node) {
    const mask = node.getAttribute('data-fa-mask')

    if (!mask) {
      return emptyCanonicalIcon()
    } else {
      return getCanonicalIcon(mask.split(' ').map(function (i) {
        return i.trim()
      }))
    }
  }

  function blankMeta () {
    return {
      iconName: null,
      title: null,
      titleId: null,
      prefix: null,
      transform: meaninglessTransform,
      symbol: false,
      mask: null,
      maskId: null,
      extra: {
        classes: [],
        styles: {},
        attributes: {}
      }
    }
  }

  function parseMeta (node) {
    const _classParser = classParser(node)
    const iconName = _classParser.iconName
    const prefix = _classParser.prefix
    const extraClasses = _classParser.rest

    const extraStyles = styleParser(node)
    const transform = transformParser(node)
    const symbol = symbolParser(node)
    const extraAttributes = attributesParser(node)
    const mask = maskParser(node)
    return {
      iconName: iconName,
      title: node.getAttribute('title'),
      titleId: node.getAttribute('data-fa-title-id'),
      prefix: prefix,
      transform: transform,
      symbol: symbol,
      mask: mask,
      maskId: node.getAttribute('data-fa-mask-id'),
      extra: {
        classes: extraClasses,
        styles: extraStyles,
        attributes: extraAttributes
      }
    }
  }

  function MissingIcon (error) {
    this.name = 'MissingIcon'
    this.message = error || 'Icon unavailable'
    this.stack = new Error().stack
  }

  MissingIcon.prototype = Object.create(Error.prototype)
  MissingIcon.prototype.constructor = MissingIcon

  const FILL = {
    fill: 'currentColor'
  }
  const ANIMATION_BASE = {
    attributeType: 'XML',
    repeatCount: 'indefinite',
    dur: '2s'
  }
  const RING = {
    tag: 'path',
    attributes: _objectSpread({}, FILL, {
      d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
    })
  }

  const OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
    attributeName: 'opacity'
  })

  const DOT = {
    tag: 'circle',
    attributes: _objectSpread({}, FILL, {
      cx: '256',
      cy: '364',
      r: '28'
    }),
    children: [{
      tag: 'animate',
      attributes: _objectSpread({}, ANIMATION_BASE, {
        attributeName: 'r',
        values: '28;14;28;28;14;28;'
      })
    }, {
      tag: 'animate',
      attributes: _objectSpread({}, OPACITY_ANIMATE, {
        values: '1;0;1;1;0;1;'
      })
    }]
  }
  const QUESTION = {
    tag: 'path',
    attributes: _objectSpread({}, FILL, {
      opacity: '1',
      d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
    }),
    children: [{
      tag: 'animate',
      attributes: _objectSpread({}, OPACITY_ANIMATE, {
        values: '1;0;0;0;0;1;'
      })
    }]
  }
  const EXCLAMATION = {
    tag: 'path',
    attributes: _objectSpread({}, FILL, {
      opacity: '0',
      d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
    }),
    children: [{
      tag: 'animate',
      attributes: _objectSpread({}, OPACITY_ANIMATE, {
        values: '0;0;1;1;0;0;'
      })
    }]
  }
  const missing = {
    tag: 'g',
    children: [RING, DOT, QUESTION, EXCLAMATION]
  }

  const styles$2 = namespace.styles

  function asFoundIcon (icon) {
    const width = icon[0]
    const height = icon[1]

    const _icon$slice = icon.slice(4)
    const _icon$slice2 = _slicedToArray(_icon$slice, 1)
    const vectorData = _icon$slice2[0]

    let element = null

    if (Array.isArray(vectorData)) {
      element = {
        tag: 'g',
        attributes: {
          class: ''.concat(config.familyPrefix, '-').concat(DUOTONE_CLASSES.GROUP)
        },
        children: [{
          tag: 'path',
          attributes: {
            class: ''.concat(config.familyPrefix, '-').concat(DUOTONE_CLASSES.SECONDARY),
            fill: 'currentColor',
            d: vectorData[0]
          }
        }, {
          tag: 'path',
          attributes: {
            class: ''.concat(config.familyPrefix, '-').concat(DUOTONE_CLASSES.PRIMARY),
            fill: 'currentColor',
            d: vectorData[1]
          }
        }]
      }
    } else {
      element = {
        tag: 'path',
        attributes: {
          fill: 'currentColor',
          d: vectorData
        }
      }
    }

    return {
      found: true,
      width: width,
      height: height,
      icon: element
    }
  }

  function findIcon (iconName, prefix) {
    return new picked(function (resolve, reject) {
      const val = {
        found: false,
        width: 512,
        height: 512,
        icon: missing
      }

      if (iconName && prefix && styles$2[prefix] && styles$2[prefix][iconName]) {
        const icon = styles$2[prefix][iconName]
        return resolve(asFoundIcon(icon))
      }

      const headers = {}

      if (_typeof(WINDOW.FontAwesomeKitConfig) === 'object' && typeof window.FontAwesomeKitConfig.token === 'string') {
        headers['fa-kit-token'] = WINDOW.FontAwesomeKitConfig.token
      }

      if (iconName && prefix && !config.showMissingIcons) {
        reject(new MissingIcon('Icon is missing for prefix '.concat(prefix, ' with icon name ').concat(iconName)))
      } else {
        resolve(val)
      }
    })
  }

  const styles$3 = namespace.styles

  function generateSvgReplacementMutation (node, nodeMeta) {
    const iconName = nodeMeta.iconName
    const title = nodeMeta.title
    const titleId = nodeMeta.titleId
    const prefix = nodeMeta.prefix
    const transform = nodeMeta.transform
    const symbol = nodeMeta.symbol
    const mask = nodeMeta.mask
    const maskId = nodeMeta.maskId
    const extra = nodeMeta.extra
    return new picked(function (resolve, reject) {
      picked.all([findIcon(iconName, prefix), findIcon(mask.iconName, mask.prefix)]).then(function (_ref) {
        const _ref2 = _slicedToArray(_ref, 2)
        const main = _ref2[0]
        const mask = _ref2[1]

        resolve([node, makeInlineSvgAbstract({
          icons: {
            main: main,
            mask: mask
          },
          prefix: prefix,
          iconName: iconName,
          transform: transform,
          symbol: symbol,
          mask: mask,
          maskId: maskId,
          title: title,
          titleId: titleId,
          extra: extra,
          watchable: true
        })])
      })
    })
  }

  function generateLayersText (node, nodeMeta) {
    const title = nodeMeta.title
    const transform = nodeMeta.transform
    const extra = nodeMeta.extra
    let width = null
    let height = null

    if (IS_IE) {
      const computedFontSize = parseInt(getComputedStyle(node).fontSize, 10)
      const boundingClientRect = node.getBoundingClientRect()
      width = boundingClientRect.width / computedFontSize
      height = boundingClientRect.height / computedFontSize
    }

    if (config.autoA11y && !title) {
      extra.attributes['aria-hidden'] = 'true'
    }

    return picked.resolve([node, makeLayersTextAbstract({
      content: node.innerHTML,
      width: width,
      height: height,
      transform: transform,
      title: title,
      extra: extra,
      watchable: true
    })])
  }

  function generateMutation (node) {
    const nodeMeta = parseMeta(node)

    if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
      return generateLayersText(node, nodeMeta)
    } else {
      return generateSvgReplacementMutation(node, nodeMeta)
    }
  }

  function onTree (root) {
    const callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    if (!IS_DOM) return
    const htmlClassList = DOCUMENT.documentElement.classList

    const hclAdd = function hclAdd (suffix) {
      return htmlClassList.add(''.concat(HTML_CLASS_I2SVG_BASE_CLASS, '-').concat(suffix))
    }

    const hclRemove = function hclRemove (suffix) {
      return htmlClassList.remove(''.concat(HTML_CLASS_I2SVG_BASE_CLASS, '-').concat(suffix))
    }

    const prefixes = config.autoFetchSvg ? Object.keys(PREFIX_TO_STYLE) : Object.keys(styles$3)
    const prefixesDomQuery = ['.'.concat(LAYERS_TEXT_CLASSNAME, ':not([').concat(DATA_FA_I2SVG, '])')].concat(prefixes.map(function (p) {
      return '.'.concat(p, ':not([').concat(DATA_FA_I2SVG, '])')
    })).join(', ')

    if (prefixesDomQuery.length === 0) {
      return
    }

    let candidates = []

    try {
      candidates = toArray(root.querySelectorAll(prefixesDomQuery))
    } catch (e) { // noop
    }

    if (candidates.length > 0) {
      hclAdd('pending')
      hclRemove('complete')
    } else {
      return
    }

    const mark = perf.begin('onTree')
    const mutations = candidates.reduce(function (acc, node) {
      try {
        const mutation = generateMutation(node)

        if (mutation) {
          acc.push(mutation)
        }
      } catch (e) {
        if (!PRODUCTION) {
          if (e instanceof MissingIcon) {
            console.error(e)
          }
        }
      }

      return acc
    }, [])
    return new picked(function (resolve, reject) {
      picked.all(mutations).then(function (resolvedMutations) {
        perform(resolvedMutations, function () {
          hclAdd('active')
          hclAdd('complete')
          hclRemove('pending')
          if (typeof callback === 'function') callback()
          mark()
          resolve()
        })
      }).catch(function () {
        mark()
        reject()
      })
    })
  }

  function onNode (node) {
    const callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    generateMutation(node).then(function (mutation) {
      if (mutation) {
        perform([mutation], callback)
      }
    })
  }

  function replaceForPosition (node, position) {
    const pendingAttribute = ''.concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(':', '-'))
    return new picked(function (resolve, reject) {
      if (node.getAttribute(pendingAttribute) !== null) {
        // This node is already being processed
        return resolve()
      }

      const children = toArray(node.children)
      const alreadyProcessedPseudoElement = children.filter(function (c) {
        return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position
      })[0]
      const styles = WINDOW.getComputedStyle(node, position)
      const fontFamily = styles.getPropertyValue('font-family').match(FONT_FAMILY_PATTERN)
      const fontWeight = styles.getPropertyValue('font-weight')
      const content = styles.getPropertyValue('content')

      if (alreadyProcessedPseudoElement && !fontFamily) {
        // If we've already processed it but the current computed style does not result in a font-family,
        // that probably means that a class name that was previously present to make the icon has been
        // removed. So we now should delete the icon.
        node.removeChild(alreadyProcessedPseudoElement)
        return resolve()
      } else if (fontFamily && content !== 'none' && content !== '') {
        const prefix = ~['Solid', 'Regular', 'Light', 'Duotone', 'Brands'].indexOf(fontFamily[1]) ? STYLE_TO_PREFIX[fontFamily[1].toLowerCase()] : FONT_WEIGHT_TO_PREFIX[fontWeight]
        const hexValue = toHex(content.length === 3 ? content.substr(1, 1) : content)
        const iconName = byUnicode(prefix, hexValue)
        const iconIdentifier = iconName // Only convert the pseudo element in this :before/:after position into an icon if we haven't
        // already done so with the same prefix and iconName

        if (iconName && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
          node.setAttribute(pendingAttribute, iconIdentifier)

          if (alreadyProcessedPseudoElement) {
            // Delete the old one, since we're replacing it with a new one
            node.removeChild(alreadyProcessedPseudoElement)
          }

          const meta = blankMeta()
          const extra = meta.extra
          extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position
          findIcon(iconName, prefix).then(function (main) {
            const abstract = makeInlineSvgAbstract(_objectSpread({}, meta, {
              icons: {
                main: main,
                mask: emptyCanonicalIcon()
              },
              prefix: prefix,
              iconName: iconIdentifier,
              extra: extra,
              watchable: true
            }))
            const element = DOCUMENT.createElement('svg')

            if (position === ':before') {
              node.insertBefore(element, node.firstChild)
            } else {
              node.appendChild(element)
            }

            element.outerHTML = abstract.map(function (a) {
              return toHtml(a)
            }).join('\n')
            node.removeAttribute(pendingAttribute)
            resolve()
          }).catch(reject)
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  function replace (node) {
    return picked.all([replaceForPosition(node, ':before'), replaceForPosition(node, ':after')])
  }

  function processable (node) {
    return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== 'svg')
  }

  function searchPseudoElements (root) {
    if (!IS_DOM) return
    return new picked(function (resolve, reject) {
      const operations = toArray(root.querySelectorAll('*')).filter(processable).map(replace)
      const end = perf.begin('searchPseudoElements')
      disableObservation()
      picked.all(operations).then(function () {
        end()
        enableObservation()
        resolve()
      }).catch(function () {
        end()
        enableObservation()
        reject()
      })
    })
  }

  const baseStyles = 'svg:not(:root).svg-inline--fa{overflow:visible}.svg-inline--fa{display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-.125em}.svg-inline--fa.fa-lg{vertical-align:-.225em}.svg-inline--fa.fa-w-1{width:.0625em}.svg-inline--fa.fa-w-2{width:.125em}.svg-inline--fa.fa-w-3{width:.1875em}.svg-inline--fa.fa-w-4{width:.25em}.svg-inline--fa.fa-w-5{width:.3125em}.svg-inline--fa.fa-w-6{width:.375em}.svg-inline--fa.fa-w-7{width:.4375em}.svg-inline--fa.fa-w-8{width:.5em}.svg-inline--fa.fa-w-9{width:.5625em}.svg-inline--fa.fa-w-10{width:.625em}.svg-inline--fa.fa-w-11{width:.6875em}.svg-inline--fa.fa-w-12{width:.75em}.svg-inline--fa.fa-w-13{width:.8125em}.svg-inline--fa.fa-w-14{width:.875em}.svg-inline--fa.fa-w-15{width:.9375em}.svg-inline--fa.fa-w-16{width:1em}.svg-inline--fa.fa-w-17{width:1.0625em}.svg-inline--fa.fa-w-18{width:1.125em}.svg-inline--fa.fa-w-19{width:1.1875em}.svg-inline--fa.fa-w-20{width:1.25em}.svg-inline--fa.fa-pull-left{margin-right:.3em;width:auto}.svg-inline--fa.fa-pull-right{margin-left:.3em;width:auto}.svg-inline--fa.fa-border{height:1.5em}.svg-inline--fa.fa-li{width:2em}.svg-inline--fa.fa-fw{width:1.25em}.fa-layers svg.svg-inline--fa{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.fa-layers{display:inline-block;height:1em;position:relative;text-align:center;vertical-align:-.125em;width:1em}.fa-layers svg.svg-inline--fa{-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter,.fa-layers-text{display:inline-block;position:absolute;text-align:center}.fa-layers-text{left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter{background-color:#ff253a;border-radius:1em;-webkit-box-sizing:border-box;box-sizing:border-box;color:#fff;height:1.5em;line-height:1;max-width:5em;min-width:1.5em;overflow:hidden;padding:.25em;right:0;text-overflow:ellipsis;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-bottom-right{bottom:0;right:0;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom right;transform-origin:bottom right}.fa-layers-bottom-left{bottom:0;left:0;right:auto;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom left;transform-origin:bottom left}.fa-layers-top-right{right:0;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-top-left{left:0;right:auto;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top left;transform-origin:top left}.fa-lg{font-size:1.3333333333em;line-height:.75em;vertical-align:-.0667em}.fa-xs{font-size:.75em}.fa-sm{font-size:.875em}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:2.5em;padding-left:0}.fa-ul>li{position:relative}.fa-li{left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}.fa-border{border:solid .08em #eee;border-radius:.1em;padding:.2em .25em .15em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left,.fab.fa-pull-left,.fal.fa-pull-left,.far.fa-pull-left,.fas.fa-pull-left{margin-right:.3em}.fa.fa-pull-right,.fab.fa-pull-right,.fal.fa-pull-right,.far.fa-pull-right,.fas.fa-pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.fa-rotate-90{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-webkit-transform:scale(-1,1);transform:scale(-1,1)}.fa-flip-vertical{-webkit-transform:scale(1,-1);transform:scale(1,-1)}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical{-webkit-transform:scale(-1,-1);transform:scale(-1,-1)}:root .fa-flip-both,:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-rotate-90{-webkit-filter:none;filter:none}.fa-stack{display:inline-block;height:2em;position:relative;width:2.5em}.fa-stack-1x,.fa-stack-2x{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.svg-inline--fa.fa-stack-1x{height:1em;width:1.25em}.svg-inline--fa.fa-stack-2x{height:2em;width:2.5em}.fa-inverse{color:#fff}.sr-only{border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.sr-only-focusable:active,.sr-only-focusable:focus{clip:auto;height:auto;margin:0;overflow:visible;position:static;width:auto}.svg-inline--fa .fa-primary{fill:var(--fa-primary-color,currentColor);opacity:1;opacity:var(--fa-primary-opacity,1)}.svg-inline--fa .fa-secondary{fill:var(--fa-secondary-color,currentColor);opacity:.4;opacity:var(--fa-secondary-opacity,.4)}.svg-inline--fa.fa-swap-opacity .fa-primary{opacity:.4;opacity:var(--fa-secondary-opacity,.4)}.svg-inline--fa.fa-swap-opacity .fa-secondary{opacity:1;opacity:var(--fa-primary-opacity,1)}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary{fill:#000}.fad.fa-inverse{color:#fff}'

  function css () {
    const dfp = DEFAULT_FAMILY_PREFIX
    const drc = DEFAULT_REPLACEMENT_CLASS
    const fp = config.familyPrefix
    const rc = config.replacementClass
    let s = baseStyles

    if (fp !== dfp || rc !== drc) {
      const dPatt = new RegExp('\\.'.concat(dfp, '\\-'), 'g')
      const customPropPatt = new RegExp('\\--'.concat(dfp, '\\-'), 'g')
      const rPatt = new RegExp('\\.'.concat(drc), 'g')
      s = s.replace(dPatt, '.'.concat(fp, '-')).replace(customPropPatt, '--'.concat(fp, '-')).replace(rPatt, '.'.concat(rc))
    }

    return s
  }

  const Library =
        /* #__PURE__ */
        (function () {
          function Library () {
            _classCallCheck(this, Library)

            this.definitions = {}
          }

          _createClass(Library, [{
            key: 'add',
            value: function add () {
              const _this = this

              for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
                definitions[_key] = arguments[_key]
              }

              const additions = definitions.reduce(this._pullDefinitions, {})
              Object.keys(additions).forEach(function (key) {
                _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key])
                defineIcons(key, additions[key])
                build()
              })
            }
          }, {
            key: 'reset',
            value: function reset () {
              this.definitions = {}
            }
          }, {
            key: '_pullDefinitions',
            value: function _pullDefinitions (additions, definition) {
              const normalized = definition.prefix && definition.iconName && definition.icon ? {
                0: definition
              } : definition
              Object.keys(normalized).map(function (key) {
                const _normalized$key = normalized[key]
                const prefix = _normalized$key.prefix
                const iconName = _normalized$key.iconName
                const icon = _normalized$key.icon
                if (!additions[prefix]) additions[prefix] = {}
                additions[prefix][iconName] = icon
              })
              return additions
            }
          }])

          return Library
        }())

  function ensureCss () {
    if (config.autoAddCss && !_cssInserted) {
      insertCss(css())

      _cssInserted = true
    }
  }

  function apiObject (val, abstractCreator) {
    Object.defineProperty(val, 'abstract', {
      get: abstractCreator
    })
    Object.defineProperty(val, 'html', {
      get: function get () {
        return val.abstract.map(function (a) {
          return toHtml(a)
        })
      }
    })
    Object.defineProperty(val, 'node', {
      get: function get () {
        if (!IS_DOM) return
        const container = DOCUMENT.createElement('div')
        container.innerHTML = val.html
        return container.children
      }
    })
    return val
  }

  function findIconDefinition (iconLookup) {
    const _iconLookup$prefix = iconLookup.prefix
    const prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix
    const iconName = iconLookup.iconName
    if (!iconName) return
    return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName)
  }

  function resolveIcons (next) {
    return function (maybeIconDefinition) {
      const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      const iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {})
      let mask = params.mask

      if (mask) {
        mask = (mask || {}).icon ? mask : findIconDefinition(mask || {})
      }

      return next(iconDefinition, _objectSpread({}, params, {
        mask: mask
      }))
    }
  }

  var library = new Library()
  const noAuto = function noAuto () {
    config.autoReplaceSvg = false
    config.observeMutations = false
    disconnect()
  }
  var _cssInserted = false
  const dom = {
    i2svg: function i2svg () {
      const params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

      if (IS_DOM) {
        ensureCss()
        const _params$node = params.node
        const node = _params$node === void 0 ? DOCUMENT : _params$node
        const _params$callback = params.callback
        const callback = _params$callback === void 0 ? function () {
        } : _params$callback

        if (config.searchPseudoElements) {
          searchPseudoElements(node)
        }

        return onTree(node, callback)
      } else {
        return picked.reject('Operation requires a DOM of some kind.')
      }
    },
    css: css,
    insertCss: function insertCss$$1 () {
      if (!_cssInserted) {
        insertCss(css())

        _cssInserted = true
      }
    },
    watch: function watch () {
      const params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      const autoReplaceSvgRoot = params.autoReplaceSvgRoot
      const observeMutationsRoot = params.observeMutationsRoot

      if (config.autoReplaceSvg === false) {
        config.autoReplaceSvg = true
      }

      config.observeMutations = true
      domready(function () {
        autoReplace({
          autoReplaceSvgRoot: autoReplaceSvgRoot
        })
        observe({
          treeCallback: onTree,
          nodeCallback: onNode,
          pseudoElementsCallback: searchPseudoElements,
          observeMutationsRoot: observeMutationsRoot
        })
      })
    }
  }
  const parse = {
    transform: function transform (transformString) {
      return parseTransformString(transformString)
    }
  }
  const icon = resolveIcons(function (iconDefinition) {
    const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const _params$transform = params.transform
    const transform = _params$transform === void 0 ? meaninglessTransform : _params$transform
    const _params$symbol = params.symbol
    const symbol = _params$symbol === void 0 ? false : _params$symbol
    const _params$mask = params.mask
    const mask = _params$mask === void 0 ? null : _params$mask
    const _params$maskId = params.maskId
    const maskId = _params$maskId === void 0 ? null : _params$maskId
    const _params$title = params.title
    const title = _params$title === void 0 ? null : _params$title
    const _params$titleId = params.titleId
    const titleId = _params$titleId === void 0 ? null : _params$titleId
    const _params$classes = params.classes
    const classes = _params$classes === void 0 ? [] : _params$classes
    const _params$attributes = params.attributes
    const attributes = _params$attributes === void 0 ? {} : _params$attributes
    const _params$styles = params.styles
    const styles = _params$styles === void 0 ? {} : _params$styles
    if (!iconDefinition) return
    const prefix = iconDefinition.prefix
    const iconName = iconDefinition.iconName
    const icon = iconDefinition.icon
    return apiObject(_objectSpread({
      type: 'icon'
    }, iconDefinition), function () {
      ensureCss()

      if (config.autoA11y) {
        if (title) {
          attributes['aria-labelledby'] = ''.concat(config.replacementClass, '-title-').concat(titleId || nextUniqueId())
        } else {
          attributes['aria-hidden'] = 'true'
          attributes.focusable = 'false'
        }
      }

      return makeInlineSvgAbstract({
        icons: {
          main: asFoundIcon(icon),
          mask: mask ? asFoundIcon(mask.icon) : {
            found: false,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix: prefix,
        iconName: iconName,
        transform: _objectSpread({}, meaninglessTransform, transform),
        symbol: symbol,
        title: title,
        maskId: maskId,
        titleId: titleId,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: classes
        }
      })
    })
  })
  const text = function text (content) {
    const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const _params$transform2 = params.transform
    const transform = _params$transform2 === void 0 ? meaninglessTransform : _params$transform2
    const _params$title2 = params.title
    const title = _params$title2 === void 0 ? null : _params$title2
    const _params$classes2 = params.classes
    const classes = _params$classes2 === void 0 ? [] : _params$classes2
    const _params$attributes2 = params.attributes
    const attributes = _params$attributes2 === void 0 ? {} : _params$attributes2
    const _params$styles2 = params.styles
    const styles = _params$styles2 === void 0 ? {} : _params$styles2
    return apiObject({
      type: 'text',
      content: content
    }, function () {
      ensureCss()
      return makeLayersTextAbstract({
        content: content,
        transform: _objectSpread({}, meaninglessTransform, transform),
        title: title,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: [''.concat(config.familyPrefix, '-layers-text')].concat(_toConsumableArray(classes))
        }
      })
    })
  }
  const counter = function counter (content) {
    const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const _params$title3 = params.title
    const title = _params$title3 === void 0 ? null : _params$title3
    const _params$classes3 = params.classes
    const classes = _params$classes3 === void 0 ? [] : _params$classes3
    const _params$attributes3 = params.attributes
    const attributes = _params$attributes3 === void 0 ? {} : _params$attributes3
    const _params$styles3 = params.styles
    const styles = _params$styles3 === void 0 ? {} : _params$styles3
    return apiObject({
      type: 'counter',
      content: content
    }, function () {
      ensureCss()
      return makeLayersCounterAbstract({
        content: content.toString(),
        title: title,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: [''.concat(config.familyPrefix, '-layers-counter')].concat(_toConsumableArray(classes))
        }
      })
    })
  }
  const layer = function layer (assembler) {
    const params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const _params$classes4 = params.classes
    const classes = _params$classes4 === void 0 ? [] : _params$classes4
    return apiObject({
      type: 'layer'
    }, function () {
      ensureCss()
      let children = []
      assembler(function (args) {
        Array.isArray(args) ? args.map(function (a) {
          children = children.concat(a.abstract)
        }) : children = children.concat(args.abstract)
      })
      return [{
        tag: 'span',
        attributes: {
          class: [''.concat(config.familyPrefix, '-layers')].concat(_toConsumableArray(classes)).join(' ')
        },
        children: children
      }]
    })
  }
  const api = {
    noAuto: noAuto,
    config: config,
    dom: dom,
    library: library,
    parse: parse,
    findIconDefinition: findIconDefinition,
    icon: icon,
    text: text,
    counter: counter,
    layer: layer,
    toHtml: toHtml
  }

  var autoReplace = function autoReplace () {
    const params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
    const _params$autoReplaceSv = params.autoReplaceSvgRoot
    const autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv
    if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) {
      api.dom.i2svg({
        node: autoReplaceSvgRoot
      })
    }
  }

  function bootstrap () {
    if (IS_BROWSER) {
      if (!WINDOW.FontAwesome) {
        WINDOW.FontAwesome = api
      }

      domready(function () {
        autoReplace()
        observe({
          treeCallback: onTree,
          nodeCallback: onNode,
          pseudoElementsCallback: searchPseudoElements
        })
      })
    }

    namespace.hooks = _objectSpread({}, namespace.hooks, {
      addPack: function addPack (prefix, icons) {
        namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, icons)
        build()
        autoReplace()
      },
      addShims: function addShims (shims) {
        let _namespace$shims;

        (_namespace$shims = namespace.shims).push.apply(_namespace$shims, _toConsumableArray(shims))

        build()
        autoReplace()
      }
    })
  }

  bunker(bootstrap)
}());

(function () {
  'use strict'

  let _WINDOW = {}
  let _DOCUMENT = {}

  try {
    if (typeof window !== 'undefined') _WINDOW = window
    if (typeof document !== 'undefined') _DOCUMENT = document
  } catch (e) {
  }

  const _ref = _WINDOW.navigator || {}
  const _ref$userAgent = _ref.userAgent
  const userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent

  const WINDOW = _WINDOW
  const DOCUMENT = _DOCUMENT
  const IS_BROWSER = !!WINDOW.document
  const IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function'
  const IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/')

  const NAMESPACE_IDENTIFIER = '___FONT_AWESOME___'
  const PRODUCTION = (function () {
    try {
      return 'production' === 'production'
    } catch (e) {
      return false
    }
  }())

  function bunker (fn) {
    try {
      fn()
    } catch (e) {
      if (!PRODUCTION) {
        throw e
      }
    }
  }

  function _defineProperty (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      })
    } else {
      obj[key] = value
    }

    return obj
  }

  function _objectSpread (target) {
    for (let i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {}
      let ownKeys = Object.keys(source)

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable
        }))
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key])
      })
    }

    return target
  }

  const w = WINDOW || {}
  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {}
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {}
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {}
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = []
  const namespace = w[NAMESPACE_IDENTIFIER]

  function defineIcons (prefix, icons) {
    const params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
    const _params$skipHooks = params.skipHooks
    const skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks
    const normalized = Object.keys(icons).reduce(function (acc, iconName) {
      const icon = icons[iconName]
      const expanded = !!icon.icon

      if (expanded) {
        acc[icon.iconName] = icon.icon
      } else {
        acc[iconName] = icon
      }

      return acc
    }, {})

    if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
      namespace.hooks.addPack(prefix, normalized)
    } else {
      namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized)
    }
    /**
         * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
         * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
         * for `fas` so we'll easy the upgrade process for our users by automatically defining
         * this as well.
         */

    if (prefix === 'fas') {
      defineIcons('fa', icons)
    }
  }

  const icons = {
    github: [496, 512, [], 'f09b', 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'],
    rss: [448, 512, [], 'f09e', 'M128.081 415.959c0 35.369-28.672 64.041-64.041 64.041S0 451.328 0 415.959s28.672-64.041 64.041-64.041 64.04 28.673 64.04 64.041zm175.66 47.25c-8.354-154.6-132.185-278.587-286.95-286.95C7.656 175.765 0 183.105 0 192.253v48.069c0 8.415 6.49 15.472 14.887 16.018 111.832 7.284 201.473 96.702 208.772 208.772.547 8.397 7.604 14.887 16.018 14.887h48.069c9.149.001 16.489-7.655 15.995-16.79zm144.249.288C439.596 229.677 251.465 40.445 16.503 32.01 7.473 31.686 0 38.981 0 48.016v48.068c0 8.625 6.835 15.645 15.453 15.999 191.179 7.839 344.627 161.316 352.465 352.465.353 8.618 7.373 15.453 15.999 15.453h48.068c9.034-.001 16.329-7.474 16.005-16.504z'],
    'telegram-plane': [448, 512, [], 'f3fe', 'M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z'],
    twitter: [512, 512, [], 'f099', 'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'],
    globe: [496, 512, [], 'f0ac', 'M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z'],
    search: [512, 512, [], 'f002', 'M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z']
  }

  bunker(function () {
    defineIcons('fas', icons)
  })
}())
