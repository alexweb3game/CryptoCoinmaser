import { Account, Transaction } from '../src'

const { privateKey, publicKey, address } = {
  publicKey: 'b68344d7369bca5d5313fc5768b317391796a7544985570cbb135ad247ec4003',
  privateKey: '76fc67623d81eca8538d0c5462534c3fb1fa5ba6d9de0e7b510778b6b040fec3b68344d7369bca5d5313fc5768b317391796a7544985570cbb135ad247ec4003',
  address: 'ef0b3f6598adfe8d1afb9cbf0ab563d86bd2b9b54c6c1c9c2950472d04186a5a'
}

describe('Account', () => {
  it('generate success', async () => {
    expect(new Account()).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        publicKey: expect.any(String),
        privateKey: expect.any(String)
      })
    )
  })

  it('validate success', async () => {
    const account = new Account(privateKey, publicKey, address)
    const res = account.hbValidate()
    expect(res).toBe(true)
  })

  it('validate failure', async () => {
    const wrongAddress = '2eaeddbbf4eaa1ed8ea9e7ccaffb95ded37d5340c39e9ca27bee9a1b644bbbf7'
    const accountWrongAddress = await new Account(privateKey, publicKey, wrongAddress)
    const resAddr = await accountWrongAddress.hbValidate()
    expect(resAddr).toBe(false)

    const wrongPubKey = 'ee4d1071006841975765a1062afaee8d665e87d5d7074c1b0e7addeae825d515'
    const accountWrongPub = await new Account(privateKey, wrongPubKey, address)
    const resPub = await accountWrongPub.hbValidate()
    expect(resPub).toBe(false)

    const wrongPriKey = 'eaab35e5e6a809765d0f957da49bda828515ed862229ff2bb9416eb317e29a8dee4d1071006841975765a1062afaee8d665e87d5d7074c1b0e7addeae825d515'
    const accountWrongPri = await new Account(wrongPriKey, publicKey, address)
    const resPri = await accountWrongPri.hbValidate()
    expect(resPri).toBe(false)
  })

  it('instance account miss param', () => {
    expect(() => new Account('a')).toThrow(new Error('private key or public key or address is miss'))
    expect(() => new Account('a', 'a')).toThrow(new Error('private key or public key or address is miss'))
  })
})

describe('Transaction', () => {
  const rawTx = 'ef0b3f6598adfe8d1afb9cbf0ab563d86bd2b9b54c6c1c9c2950472d04186a5a01000000000000000200000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e74087472616e736665720002201be204cbe97dcd70275ffc2e85d996900526ba54549b86f76e479e7c989991660800e40b5402000000e80300000000000001000000000000000bce0469000000001f0020b68344d7369bca5d5313fc5768b317391796a7544985570cbb135ad247ec400340c9705b6a7a3d1dc45f0ca5eb9bf5ebb4650bf9152472cd837b143c5986b333f2d08b1c1063827240b8661a1765d7ee71e1bdb9898715349cf700ac8239792208'

  it('sign transaction', async () => {
    const txHash = 'd3548d9201de3e213f69c9ef7be008d19bfec83a29d37a251e5b55cb6eb24b4e'
    const tx = await new Transaction().hbBuild({
      chain_id: '31',
      from: 'ef0b3f6598adfe8d1afb9cbf0ab563d86bd2b9b54c6c1c9c2950472d04186a5a',
      to: '1be204cbe97dcd70275ffc2e85d996900526ba54549b86f76e479e7c98999166',
      amount: '10000000000',
      fee_step: '1000',
      fee_price: '1',
      nonce: 1,
      expire_time: 1761922571000
    }).hbSign([privateKey])
    expect(tx.hbSerialize()).toEqual(rawTx)
    expect(tx.hbGetTxHash()).toEqual(txHash)
  })

  it('deserialize', () => {
    const transactionDeserialize = new Transaction(rawTx)
    const expectResult = {
      from: 'ef0b3f6598adfe8d1afb9cbf0ab563d86bd2b9b54c6c1c9c2950472d04186a5a',
      to: '1be204cbe97dcd70275ffc2e85d996900526ba54549b86f76e479e7c98999166',
      amount: '10000000000',
      chainId: '31',
      gasLimit: '1000',
      gasPrice: '1',
      nonce: 1,
      expireTime: 1761922571000
    }

    expect(transactionDeserialize).toEqual(expect.objectContaining(expectResult))
  })
})
