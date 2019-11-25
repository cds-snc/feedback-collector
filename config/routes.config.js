// 1) add your route(s) here ⬇️
const routes = [
  { name: 'add-form', path: { en: '/add-form', fr: '/fr-add-form' } },
  { name: 'my-forms', path: { en: '/my-forms', fr: '/fr-my-forms' } },
  { name: 'validate', path: { en: '/validate', fr: '/fr-validate' } },
  { name: 'send', path: { en: '/send', fr: '/fr-send' } },
  { name: 'login', path: { en: '/login', fr: '/fr-login' } },
  { name: 'delete-form', path: "/delete-form" },
  { name: 'download-responses', path: "/download-responses" },
]

const locales = ['en', 'fr']

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
  locales,
}
