const { routeUtils } = require('./../../utils')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      console.log(req.query.code)
      // if (req.query.code) {
      //   route.doRedirect("invalid")(req, res)
      //   return
      // }
      res.render(name, routeUtils.getViewData(req, {}))

    })
}
