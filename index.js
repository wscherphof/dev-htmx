import htmx from "./htmx";
import "https://unpkg.com/hyperscript.org@0.9.4"; // not yet on npm

let INITED;

function init(options = {}) {
  if (INITED) {
    return;
  } else {
    INITED = true;
  }
  const defaults = {
    appId: "app",
    dev: {
      protocol: "http",
      address: "localhost",
      port: "3001",
    },
    api: {
      protocol: "http",
      address: "localhost",
      port: "3000",
    },
  };
  options.dev = Object.assign(defaults.dev, options.dev);
  options.api = Object.assign(defaults.api, options.api);
  options = Object.assign(defaults, options);
  const { appId, dev, api } = options;
  // pass either protocol and/or address and/or port, or the complete origin
  dev.origin = dev.origin || `${dev.protocol}://${dev.address}:${dev.port}`;
  api.origin = api.origin || `${api.protocol}://${api.address}:${api.port}`;

  const DEVELOPMENT = window.location.origin === dev.origin;
  const APP = htmx.find(`#${appId}`);

  htmx.on("htmx:configRequest", function ({ detail }) {
    // if served from dev, force htmx requests to the api server
    const url = new URL(
      detail.path,
      DEVELOPMENT ? api.origin : window.location.origin
    );
    detail.path = url.toString();
    // when targeting the app itself, tell the server we want the complete app
    // HTML, even though we're an HTMX-request
    if (detail.target === APP) {
      detail.headers["HX-Init"] = true;
    }
  });

  if (DEVELOPMENT) {
    // fetch the inial app HTML
    const { pathname, search } = window.location;
    htmx.ajax("GET", pathname + search, {
      source: APP,
    });
  }
}

export default { init };
