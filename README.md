# Feedback Collector

**Demo:** http://cds-feedback-collector.herokuapp.com/

**Based on node-starter-app** https://github.com/cds-snc/node-starter-app/

## Intro 

The Feedback Collector captures form data and i) emails it to you (if you want) and ii) puts it in a database for later analysis. 

The Feedback Collector provides a generic URL endpoint to submit forms to. Depending on your choice it will then i) redirect the user to a page that you specify, or ii) send a json response confirming the data was recieved. 

To set up, log in here: https://notification-demo-service.firebaseapp.com/ and go through the steps to add a new form. After confirming your email you can then use the endpoint with the ID generated for your form.

## Usage

After you login and create a form, you will get an email with a confirmation link. At that point you can hook this up to your form! Copy the ID for your form from the [my-forms page](https://cds-feedback-collector.herokuapp.com/en/my-forms) into the form you wish to hook up:
```
<form method="post" action="https://us-central1-notification-demo-service.cloudfunctions.net/send?id=YOUR_FORM_ID" />
```

That's all there is to it!


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
