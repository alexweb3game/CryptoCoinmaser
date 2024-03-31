import Account from '../src/account'
import Transaction from '../src/transaction'

describe('Account', () => {
  const pwd = '123456'
  const accountObj = new Account()
  const { address, publicKey, encryptPrivkey } = {
    publicKey: '335bfc4b3713d77198abace0de5b24dcf88e3c792cb303b5e0c6946ab2a6309c',
    encryptPrivkey: '3W5j71zLqy1WaVW8JEUnZIxfgI0GcN6r4/8rgShc1hwRBFqyzAGf6bLc5DbuzZrMGrk04paX/R4xhmGFpQ5cFExbxQc5dxh++ZmG9dJFpKdT4Hi/RXTjEakxIa2MQdUALLEPd5/bBK2tw2Hcv71/7y7camDmIbtJfnPoxarp7F/BQYpEK3A205+/7LfPMghL',
    address: '90c0dcd788a5636ebb82f07ea1bc95ef5d9e297c67bd183e7ee9eeabe33bf774'
  }

  it('generate', async () => {
    const account = await accountObj.iGenerate(pwd)
    expect(account).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        public_key: expect.any(String),
        private_key: expect.any(String)
      })
    )
  })

  it('validate', async () => {
    const res = await accountObj.iValidate(address, encryptPrivkey, pwd, publicKey)
    expect(res).toBe(true)
  })
})

describe('Transaction', () => {
  it('sign', async () => {
    const tx = new Transaction()
    const signRes = await tx.iSign({
      chain_id: '31',
      from: 'ef0b3f6598adfe8d1afb9cbf0ab563d86bd2b9b54c6c1c9c2950472d04186a5a',
      to: '1be204cbe97dcd70275ffc2e85d996900526ba54549b86f76e479e7c98999166',
      amount: '100000000',
      fee_step: '1000',
      fee_price: '1',
      nonce: 1,
      expire_time: 1661469479000
    }, ['c40a5f257b7c7659ee97f999badfcf9fca3a1810d871a34688fc3c885da83d2c335bfc4b3713d77198abace0de5b24dcf88e3c792cb303b5e0c6946ab2a6309c'])
    expect(signRes).toEqual(
      expect.objectContaining({
        txhash: '22affddea2178b81602607295b15419fdb43a2203dd08d0396c024dea381366c',
        output: 'ef0b3f6598adfe8d1afb9cbf0ab563d86bd2b9b54c6c1c9c2950472d04186a5a01000000000000000200000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e74087472616e736665720002201be204cbe97dcd70275ffc2e85d996900526ba54549b86f76e479e7c989991660800e1f50500000000e803000000000000010000000000000027030863000000001f0020335bfc4b3713d77198abace0de5b24dcf88e3c792cb303b5e0c6946ab2a6309c400c4cf075830b042775ea6b736e25bc5c307cedd3a3aea91d058f2e49d4d8dedd2215cb87343ea827317dd4d2dba686c6f89e81e86ba81e8659e3ffa04079da09'
      })
    )
  })
})
