import 'htmx.org' // htmx from or { htmx } from don't work
import 'https://unpkg.com/hyperscript.org@0.9.3' // not yet on npm

let APP_PATH = '/app' // eslint-disable-line
let DEV_PROTOCOL = 'http' // eslint-disable-line
let DEV_ADDRESS = 'localhost' // eslint-disable-line
let DEV_PORT = 3001 // eslint-disable-line
let DEV_BASE = `${DEV_PROTOCOL}://${DEV_ADDRESS}:${DEV_PORT}` // eslint-disable-line
let API_PROTOCOL = 'http' // eslint-disable-line
let API_ADDRESS = 'localhost' // eslint-disable-line
let API_PORT = 3000 // eslint-disable-line
let API_BASE = `${API_PROTOCOL}://${API_ADDRESS}:${API_PORT}` // eslint-disable-line

htmx.on('htmx:configRequest', function ({ detail }) { // eslint-disable-line
  const { origin, pathname, search } = window.location
  const DEVELOPMENT = origin === DEV_BASE
  const url = new URL(detail.path, DEVELOPMENT ? API_BASE : origin)
  if (detail.path === APP_PATH) {
    url.searchParams.append('url', encodeURIComponent(`${pathname}${search}`))
  }
  detail.path = url.toString()
})

htmx.on('htmx:beforeSend', function ({ detail }) { // eslint-disable-line
  detail.xhr.withCredentials = true
})
