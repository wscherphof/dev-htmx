import 'htmx.org' // htmx from or { htmx } from don't work
import 'https://unpkg.com/hyperscript.org@0.9.3' // not yet on npm

let APP_ID = 'app' // eslint-disable-line
let APP_PATH = '/app' // eslint-disable-line
let DEV_ADDRESS = 'localhost' // eslint-disable-line
let DEV_PORT = 3001 // eslint-disable-line
let API_PROTOCOL = 'http' // eslint-disable-line
let API_ADDRESS = 'localhost' // eslint-disable-line
let API_PORT = 3000 // eslint-disable-line

function refreshed(detail) {
  return detail.target.id === APP_ID && detail.path !== APP_PATH
}

htmx.on('htmx:configRequest', function ({ detail }) { // eslint-disable-line
  const { pathname, host, search } = window.location
  if (refreshed(detail)) {
    // Pass the browser's url, so that the fastify-htmx can add an [hx-get]
    // element to the page, should it not reside on the home page.
    const url = encodeURIComponent(`${pathname}${search}`)
    const questionMark = detail.path.includes('?') ? '&' : '?'
    detail.path = `${detail.path}${questionMark}url=${url}`
  }
  if (host === `${DEV_ADDRESS}:${DEV_PORT}` && detail.path.startsWith('/')) {
    // don't ask the dev server; ask the api server
    detail.path = `${API_PROTOCOL}://${API_ADDRESS}:${API_PORT}${detail.path}`
  }
})

htmx.on('htmx:afterSettle', function ({ detail }) { // eslint-disable-line
  const { pathname, search } = window.location
  if (refreshed(detail)) {
    // A URL was pushed and the user refreshed the page. The /app was loaded in
    // the #app. Now we look up the [hx-get] element that issued the push, and
    // click on it to get its content loaded in its target.
    let element
    if (search) {
      element = document.querySelector(`[hx-get="${pathname}"]`) ||
        document.querySelector(`[hx-get="${pathname}${search}"]`)
    } else {
      element = document.querySelector(`[hx-get="${pathname}"]`) ||
        document.querySelector(`[hx-get^="${pathname}?"]`)
    }
    if (element) {
      element.click()
    }
  }
})

htmx.on('htmx:beforeSend', function ({ detail }) { // eslint-disable-line
  detail.xhr.withCredentials = true
})
