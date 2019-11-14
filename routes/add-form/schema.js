/* istanbul ignore file */

const Schema = {
  name: {
    isLength: {
      errorMessage: 'errors.name.length',
      options: { min: 3, max: 200 },
    },
  },
  email: {
    isLength: {
      errorMessage: 'errors.email.length',
      options: { min: 3, max: 200 },
    },
  },
  redirect_url: {
    isLength: {
      errorMessage: 'errors.redirect.length',
      options: { min: 3, max: 200 },
    },
  },
}

module.exports = {
  Schema,
}
