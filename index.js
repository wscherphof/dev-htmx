import 'htmx.org' // htmx from or { htmx } from don't work
import 'https://unpkg.com/hyperscript.org@0.9.3' // not yet on npm

// FIXME: make a proper module with an options object
let HOME_PATH = '/' // eslint-disable-line
let APP_ID = 'app' // eslint-disable-line
let PUSH_SELECTOR = 'main' // eslint-disable-line

let DEV_PROTOCOL = 'http' // eslint-disable-line
let DEV_ADDRESS = 'localhost' // eslint-disable-line
let DEV_PORT = 3001 // eslint-disable-line
let DEV_ORIGIN = `${DEV_PROTOCOL}://${DEV_ADDRESS}:${DEV_PORT}` // eslint-disable-line

let API_PROTOCOL = 'http' // eslint-disable-line
let API_ADDRESS = 'localhost' // eslint-disable-line
let API_PORT = 3000 // eslint-disable-line
let API_ORIGIN = `${API_PROTOCOL}://${API_ADDRESS}:${API_PORT}` // eslint-disable-line

// if served from dev, force ajax urls to the api server
htmx.on('htmx:configRequest', function ({ detail }) { // eslint-disable-line
  const { origin } = window.location
  const DEVELOPMENT = origin === DEV_ORIGIN
  const url = new URL(detail.path, DEVELOPMENT ? API_ORIGIN : origin)
  detail.path = url.toString()
})

// after loading the app, fetch any pushed url's content
htmx.on('htmx:afterSwap', function ({ detail }) { // eslint-disable-line
  const { pathname, search } = window.location
  if (detail.target.id === APP_ID && pathname !== HOME_PATH) {
    const push = `${pathname}${search}`
    htmx.ajax('GET', push, PUSH_SELECTOR) // eslint-disable-line
  }
})

htmx.on('htmx:beforeSend', function ({ detail }) { // eslint-disable-line
  detail.xhr.withCredentials = true
})
