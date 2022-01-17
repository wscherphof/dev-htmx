import 'htmx.org' // htmx from or { htmx } from don't work
import 'https://unpkg.com/hyperscript.org@0.9.3' // not yet on npm

let INITED

function init (options = {}) {
  if (INITED) {
    return
  } else {
    INITED = true
  }
  const defaults = {
    homePath: '/',
    appId: 'app',
    pushSelector: 'main',
    dev: {
      protocol: 'http',
      address: 'localhost',
      port: '3001'
    },
    api: {
      protocol: 'http',
      address: 'localhost',
      port: '3000'
    }
  }
  options.dev = Object.assign(defaults.dev, options.dev)
  options.api = Object.assign(defaults.api, options.api)
  options = Object.assign(defaults, options)
  const { homePath, appId, pushSelector, dev, api } = options
  // pass either protocol and/or address and/or port, or the complete origin
  dev.origin = dev.origin || `${dev.protocol}://${dev.address}:${dev.port}`
  api.origin = api.origin || `${api.protocol}://${api.address}:${api.port}`

  // if served from dev, force ajax urls to the api server
  htmx.on('htmx:configRequest', function ({ detail }) { // eslint-disable-line
    const { origin, pathname, search } = window.location
    const development = origin === dev.origin
    const url = new URL(detail.path, development ? api.origin : origin)
    if (detail.target.id === appId && pathname === homePath) {
      url.search = search
    }
    detail.path = url.toString()
  })

  // after loading the app, fetch any pushed url's content
  htmx.on('htmx:afterSwap', function ({ detail }) { // eslint-disable-line
    const { pathname, search } = window.location
    if (detail.target.id === appId && pathname !== homePath) {
      const push = `${pathname}${search}`
      htmx.ajax('GET', push, pushSelector) // eslint-disable-line
    }
  })

  const app = document.querySelector(`#${appId}`)
  const init = new Event('init') // eslint-disable-line
  app.dispatchEvent(init)
}

export default { init }
