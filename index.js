'use strict'

const { createEnvelopeEncryptor } = require('@autotelic/envelope-encryptor')
const fp = require('fastify-plugin')

function fastifyEnvelopeEncryptor (fastify, opts, next) {
  const keyService = opts.keyService

  if (!keyService) {
    return next(new Error('The `keyService` option must be provided.'))
  }

  if (!Object.keys(keyService).includes('getDataKey')) {
    next(new Error('Invalid `keyService`: missing `getDataKey`.'))
    return
  }

  if (!Object.keys(keyService).includes('decryptDataKey')) {
    next(new Error('Invalid `keyService`: missing `decryptDataKey`.'))
    return
  }

  const envelopeEncryptor = createEnvelopeEncryptor(opts.keyService)

  fastify.decorate('envelopeEncryptor', envelopeEncryptor)

  next()
}

module.exports = fp(fastifyEnvelopeEncryptor, {
  fastify: '4.x',
  name: 'fastify-envelope-encryptor'
})
module.exports.default = fastifyEnvelopeEncryptor
module.exports.fastifyEnvelopeEncryptor = fastifyEnvelopeEncryptor
