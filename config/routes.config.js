// 1) add your route(s) here ⬇️
const routes = [
  { name: 'start', path: { en: '/start', fr: '/debut' } },
  { name: 'add-form', path: { en: '/add-form', fr: '/fr-add-form' } },
  { name: 'my-forms', path: { en: '/my-forms', fr: '/fr-my-forms' } },
  { name: 'personal', path: { en: '/personal', fr: '/personnel' } },
  { name: 'validate', path: { en: '/validate', fr: '/fr-validate' } },
]

const locales = ['en', 'fr']

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
  locales,
}
