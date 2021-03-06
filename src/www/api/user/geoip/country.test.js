/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/geoip/country', () => {
  describe('exceptions', () => {
    describe('invalid-ip', () => {
      it('missing querystring ip', async () => {
        const req = TestHelper.createRequest('/api/user/geoip/country')
        let errorMesage
        try {
          await req.get()
        } catch (error) {
          errorMesage = error.message
        }
        assert.strictEqual(errorMesage, 'invalid-ip')
      })

      it('invalid querystring ip', async () => {
        const req = TestHelper.createRequest('/api/user/geoip/country?ip=invalid')
        let errorMesage
        try {
          await req.get()
        } catch (error) {
          errorMesage = error.message
        }
        assert.strictEqual(errorMesage, 'invalid-ip')
      })
    })
  })

  describe('receives', () => {
    it('required querystring ip', async () => {
      const req = TestHelper.createRequest('/api/user/geoip/country?ip=8.8.8.8')
      const country = await req.get()
      assert.strictEqual(country.country.iso_code, 'US')
    })
  })

  describe('returns', () => {
    it('object', async () => {
      const req = TestHelper.createRequest('/api/user/geoip/country?ip=8.8.8.8')
      req.filename = __filename
      req.saveResponse = true
      const country = await req.get()
      assert.strictEqual(country.country.iso_code, 'US')
    })
  })
})
