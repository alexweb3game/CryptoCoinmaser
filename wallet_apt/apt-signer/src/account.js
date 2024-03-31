import { Aes } from '@common/crypto'
import { BaseAccount } from '@common/sign'
import * as Token from '@tokens/apt'

class Account extends BaseAccount {
  /**
     * generate address by password
     * @param {string} password - password
     * @returns {object} - new account
     */
  async iGenerate (password) {
    const account = new Token.Account()
    return {
      address: account.address,
      public_key: account.publicKey,
      private_key: Aes.encrypt(account.privateKey, password)
    }
  }

  /**
     * validate address
     * @param {string} address - real address
     * @param {string} encryptPrivKey - encrypted private key
     * @param {string} password - password
     * @param {string} publicKey - public key
     * @returns {boolean} - whether address is valid
     */
  async iValidate (address, encryptPrivKey, password, publicKey) {
    const privateKey = Aes.decrypt(encryptPrivKey, password, '')
    const account = new Token.Account(privateKey, publicKey, address)
    return account.hbValidate()
  }

  /**
     * iSignMsg
     * implSignMessage interface for child class (Factory Mode)
     * @param {string} msg - be signed message
     * @param {string} address - addr
     * @param {string} encryptPrivKey - private key
     * @param {string} password - password
     * @param {string} publicKey - public key
    */
  async iSignMsg (msg, address, encryptPrivKey, password, publicKey) {
    const privateKey = Aes.decrypt(encryptPrivKey, password, '')
    const account = new Token.Account(privateKey, publicKey, address)

    return account.hbSignMsg(msg)
  }
}

export default Account
