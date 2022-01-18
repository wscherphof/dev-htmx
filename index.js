import htmx from './htmx'
import 'https://unpkg.com/hyperscript.org@0.9.3' // not yet on npm

let INITED

function init(options = {}) {
  if (INITED) {
    return
  } else {
    INITED = true
  }
  const defaults = {
    homePath: '/',
    appId: 'app',
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
  const { homePath, appId, dev, api } = options
  // pass either protocol and/or address and/or port, or the complete origin
  dev.origin = dev.origin || `${dev.protocol}://${dev.address}:${dev.port}`
  api.origin = api.origin || `${api.protocol}://${api.address}:${api.port}`

  const DEVELOPMENT = window.location.origin === dev.origin

  htmx.on('htmx:configRequest', function ({ detail }) {
    const { origin, pathname, search } = window.location
    // if served from dev, force ajax urls to the api server
    const url = new URL(detail.path, DEVELOPMENT ? api.origin : origin)
    if (detail.target.id === appId && pathname === homePath) {
      // append the search params from the address bar
      url.search = search
    }
    detail.path = url.toString()
  })

  if (DEVELOPMENT) {
    // fetch the HTML
    const { pathname, search } = window.location
    htmx.ajax('GET', pathname + search, {
      source: htmx.find(`#${appId}`),
      headers: { 'HX-Init': true }
    })
  }
}

export default { init }
