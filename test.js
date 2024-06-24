const Fastify = require('fastify')
const test = require('ava')
const { dummyKms } = require('@autotelic/envelope-encryptor')
const { fastifyEnvelopeEncryptor } = require('.')

test('No keyService option provided throws error', async t => {
  t.plan(1)
  const fastify = Fastify()
  await t.throwsAsync(fastify.register(fastifyEnvelopeEncryptor), {
    message: 'The `keyService` option must be provided.'
  })
})

test('keyService option missing getDataKey throws error', async t => {
  t.plan(1)
  const fastify = Fastify()
  await t.throwsAsync(fastify.register(fastifyEnvelopeEncryptor, {
    keyService: {}
  }), {
    message: 'Invalid `keyService`: missing `getDataKey`.'
  })
})

test('keyService option missing decryptDataKey throws error', async t => {
  t.plan(1)
  const fastify = Fastify()
  await t.throwsAsync(fastify.register(fastifyEnvelopeEncryptor, {
    keyService: { getDataKey: () => {} }
  }), {
    message: 'Invalid `keyService`: missing `decryptDataKey`.'
  })
})

test('valid keyService registers successfully', async t => {
  t.plan(1)
  const fastify = Fastify()
  await t.notThrowsAsync(fastify.register(fastifyEnvelopeEncryptor, {
    keyService: dummyKms()
  }))
})

test('valid keyService encrypts & decrypts successfully', async t => {
  t.plan(1)
  const fastify = Fastify()
  fastify.register(fastifyEnvelopeEncryptor, {
    keyService: dummyKms()
  })
  await fastify.ready()
  const { encrypt, decrypt } = fastify.envelopeEncryptor
  const encrypted = await encrypt('hello')
  const decrypted = await decrypt(encrypted)
  t.is(decrypted, 'hello')
})
