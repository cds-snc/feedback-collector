const request = require('supertest')
const app = require('../../app.js')

test('Can send get request personal route ', async () => {
  const route = app.routes.get('personal')
  const response = await request(app).get(route.path.en)
  expect(response.statusCode).toBe(200)
})

jest.mock('../../utils/flash.message.helpers', () => ({
  getFlashMessage: jest.fn(req => {
    return { fieldname: { value: '', msg: 'caught this error', param: 'testerror', location: 'body' } }
  }),
}))

test('Display errors on the page', async () => {
  const route = app.routes.get('personal')
  const response = await request(app).get(route.path.en)
  expect(response.statusCode).toBe(200)
  expect(response.text).toContain('caught this error')
})
