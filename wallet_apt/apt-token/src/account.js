const SHA3 = require('js-sha3')
const Nacl = require('tweetnacl')

export default class Account {
  /**
     * creates an instance of Account.
     * @param {string} [privateKey]
     * @param {string} [publicKey]
     * @param {string} [address]
     */
  constructor (privateKey, publicKey, address) {
    if (privateKey && publicKey && address) {
      this.address = address
      this.publicKey = publicKey
      this.privateKey = privateKey
    } else if (!privateKey && !publicKey && !address) {
      const keyPair = Nacl.sign.keyPair()
      this.publicKey = Buffer.from(keyPair.publicKey).toString('hex')
      this.privateKey = Buffer.from(keyPair.secretKey).toString('hex')
      const hash = SHA3.sha3_256.create()
      hash.update(Buffer.from(keyPair.publicKey))
      hash.update('\x00')
      this.address = hash.hex()
    } else {
      throw new Error('private key or public key or address is miss')
    }
  }

  /**
     * validate address
     * @returns {boolean}
     */
  hbValidate () {
    const { privateKey, publicKey, address } = this
    const keyPair = Nacl.sign.keyPair.fromSecretKey(Buffer.from(privateKey, 'hex'))
    const pubKeyFromPrivate = Buffer.from(keyPair.publicKey).toString('hex')
    const hash = SHA3.sha3_256.create()
    hash.update(Buffer.from(keyPair.publicKey))
    hash.update('\x00')
    const addressFromPrivate = hash.hex()
    return pubKeyFromPrivate === publicKey && addressFromPrivate === address
  }

  /**
     * sign message
     * @param {string} [msg] messages that need to be signed
     * @returns {string}
     */
  hbSignMsg (msg) {
    const { privateKey } = this
    const signature = Nacl.sign(Buffer.from(msg), Buffer.from(privateKey, 'hex'))
    return Buffer.from(signature).toString('hex')
  }
}
