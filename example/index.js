'use strict'

const { fastifyEnvelopeEncryptor } = require('../')

module.exports = async function (fastify, options) {
  fastify.register(fastifyEnvelopeEncryptor, { keyService: {} })

  fastify.get('/', async function (req, reply) {
    return { hello: 'world' }
  })
}
