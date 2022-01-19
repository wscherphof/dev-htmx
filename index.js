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
    // if served from dev, force htmx requests to the api server
    const url = new URL(detail.path, DEVELOPMENT ? api.origin : window.location.origin)
    detail.path = url.toString()
  })

  if (DEVELOPMENT) {
    // fetch the inial app HTML
    const { pathname, search } = window.location
    htmx.ajax('GET', pathname + search, {
      source: htmx.find(`#${appId}`),
      headers: { 'HX-Init': true }
    })
  }
}

export default { init }
