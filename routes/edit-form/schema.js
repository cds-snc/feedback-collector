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
  redirect: {
    custom: {
      options: (value, { req }) => {
        const redirect = req.body.redirect
        if (!redirect) {
          return false
        }
        return true
      },
      errorMessage: 'errors.redirect',
    },
  },
}

module.exports = {
  Schema,
}
