# Feedback Collector

**Demo:** http://cds-feedback-collector.herokuapp.com/

**Based on node-starter-app** https://github.com/cds-snc/node-starter-app/

## Install + Dev Mode

```bash
npm install
npm run dev
```

## Adding Routes
Generate the route files
```
node ./bin/route.js create --route your_route_name
```

The created route directory by default contains the following files:
- your_route_name.controller.js
- your_route_name.pug
- schema.js (used for form views)


Register the route via [routes.config.js](https://github.com/cds-snc/node-starter-app/blob/master/config/routes.config.js)

```javascript
// config/routes.config.js
...
const routes = [
  { name: "your_route_name", path: "/your_route_name" },
];
...
```

Note: Delete unused route(s) directories as needed.

## Form step redirects

Redirects are handled via `route.doRedirect()`. The doRedirect function will do a look up for the next route based on the routes config.

For cases where the redirect is not straight forward you can pass in a function, which can return a route name or a route object:

```javascript
// routes.config.js
const routes = [
  ...
  { name: 'my-route', ..., skipTo: 'other-route' }
  ...
]

// my-route.controller.js
route.draw(app)
  .post(..., route.doRedirect((req, res) => shouldSkip(req) ? route.skipTo : route.next))
```

## Template Engine

[Nunjucks](https://mozilla.github.io/nunjucks/)
