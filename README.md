# dev-htmx

Enables [HTMX](https://htmx.org) hypermedia applications from a frontend
"bundler", e.g. Vite, Snowpack, WebPack, Rollup, or Parcel.

## Install

```shell
npm install dev-htmx
```

## import

Then, in your `main.js`:

```js
import devHtmx from 'dev-htmx';
devHtmx.init();
```

Optional options object parameter to `init`:

- `appId`: The value of the `id` attribute of the element in your `index.html`
  that will contain your app's HTML content. Default: `app`.
- `api`: An object addressing the "API server" that renders the application's
  HTML. Default: `{ protocol: 'http', address: 'localhost', port: '3000' }`.
- `dev`: An object addressing the "development server" that your bundler can run
  to serve your unbundled assets. Default: `{ protocol: 'http', address: 'localhost', port: '3001' }`.
- For `api` and `dev`, you can pass any number of its properties to ovveride the
  default, e.g. `{ port: 5000 }`.

## Features

Goal is to be able to be able to serve the frontend from the bundler's `dev`
server, while having the HTML content generated from the `api` server, and still
enjoying all development server features, like Hot Module Replacement.

- When partial HTML content is requested through Ajax, the request is directed
  to the `api` server, even if the app is currently running on the `dev` server.
- When loaded from the development server, the app's content is fetched
  automatically from the `api` server, and injected into the `appId` element of
  the local `index.html`. To indicate that the complete app's HTML is needed,
  even though it's requested through Ajax, the `HX-Init` header is sent along.

## Example

An example setup, using [Vite](https://vitejs.dev/) as the bundler, and
[Fastify](https://www.fastify.io) as the (Nodejs) api server, can be found here:
https://github.com/wscherphof/fastify-htmxample.

## CORS

Note that when an Ajax request is made to the `api` server from the page served
by the `dev` server, the request is bound to the browser's [Cross-Origin
Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
policies.

This means the `api` server needs to explicitly allow requests from the `dev`
server origin, by providing the proper response header values.

The [HTMX request headers](https://htmx.org/reference/#request_headers) should be listed in the CORS "allowed headers"; the [HTMX response headers](https://htmx.org/reference/#response_headers) in the CORS "exposed headers".

An example of these settings can be found in the fastify-htmx plugin
[code](https://github.com/wscherphof/fastify-htmx/blob/main/index.js).
