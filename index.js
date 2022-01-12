import 'htmx.org' // htmx from or { htmx } from don't work
import 'https://unpkg.com/hyperscript.org@0.9.3' // not yet on npm

let APP_URL = '/app' // eslint-disable-line
let DEV_ADDRESS = 'localhost' // eslint-disable-line
let DEV_PORT = 3001 // eslint-disable-line
let API_PROTOCOL = 'http' // eslint-disable-line
let API_ADDRESS = 'localhost' // eslint-disable-line
let API_PORT = 3000 // eslint-disable-line

htmx.on('htmx:configRequest', function ({ detail }) { // eslint-disable-line
  const { pathname, host, search } = window.location
  if (detail.path === APP_URL && pathname !== '/') {
    // on load, fetch the content matching the url
    detail.path = pathname + search
  }
  if (host === `${DEV_ADDRESS}:${DEV_PORT}` && detail.path.startsWith('/')) {
    // vite dev server proxy to fastify
    detail.path = `${API_PROTOCOL}://${API_ADDRESS}:${API_PORT}${detail.path}`
  }
})
