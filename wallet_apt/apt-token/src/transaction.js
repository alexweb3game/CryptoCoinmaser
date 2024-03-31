import chainProperties from './constants'
const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require('aptos')

export default class Transaction {
  constructor (signedRaw) {
    if (signedRaw) {
      const bcsTxn = Uint8Array.from(Buffer.from(signedRaw, 'hex'))
      const signedTxn = TxnBuilderTypes.SignedTransaction.deserialize(new BCS.Deserializer(bcsTxn))
      const txArgs = signedTxn.raw_txn.payload.value.args
      const chainId = signedTxn.raw_txn.chain_id.value.toString()
      const fromAddress = Buffer.from(signedTxn.raw_txn.sender.address).toString('hex')
      const toAddress = Buffer.from(txArgs[0]).toString('hex')
      const deserializer = new BCS.Deserializer(txArgs[1])
      const amount = deserializer.deserializeU64().toString()
      Object.assign(this, {
        chainId,
        from: fromAddress,
        to: toAddress,
        amount,
        nonce: parseInt(signedTxn.raw_txn.sequence_number),
        gasPrice: signedTxn.raw_txn.gas_unit_price.toString(),
        gasLimit: signedTxn.raw_txn.max_gas_amount.toString(),
        expireTime: parseInt(signedTxn.raw_txn.expiration_timestamp_secs) * 1000
      })
    }
  }

  /**
     * build transaction
     * @param {object} txData
     * @returns {Transaction}
     */
  hbBuild (txData) {
    const {
      from,
      to,
      amount,
      nonce,
      fee_price: gasPrice,
      fee_step: gasLimit,
      expire_time: expireTime,
      chain_id: chainId
    } = txData
    const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
      TxnBuilderTypes.EntryFunction.natural(
        chainProperties.transferModule,
        chainProperties.transferFunction,
        [],
        [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(to)), BCS.bcsSerializeUint64(amount)]
      )
    )
    this.unsignedTx = new TxnBuilderTypes.RawTransaction(
      TxnBuilderTypes.AccountAddress.fromHex(from),
      BigInt(nonce),
      entryFunctionPayload,
      BigInt(gasLimit),
      BigInt(gasPrice),
      BigInt(parseInt(expireTime / 1000)),
      new TxnBuilderTypes.ChainId(chainId)
    )
    return this
  }

  /**
     * serialize tx
     * @returns {string}
     */
  hbSerialize () {
    return this.hbSerialized
  }

  /**
     * get tx hash
     * @returns {string}
     */
  hbGetTxHash () {
    return this.hbTxHash
  }

  /**
     * sign transaction
     * @param {string[]} privateKeys
     * @returns {Transaction}
     */
  hbSign (privateKeys) {
    const { unsignedTx } = this
    // 获取签名账户
    const fromAccount = new AptosAccount(Uint8Array.from(Buffer.from(privateKeys[0], 'hex')))
    // 离线签名
    const bcsTxn = AptosClient.generateBCSTransaction(fromAccount, unsignedTx)
    // uint8转hex
    this.hbSerialized = Buffer.from(bcsTxn).toString('hex')
    // 计算Hash
    const signedTxn = TxnBuilderTypes.SignedTransaction.deserialize(new BCS.Deserializer(bcsTxn))
    const hashBin = new TxnBuilderTypes.UserTransaction(signedTxn).hash()
    this.hbTxHash = Buffer.from(hashBin).toString('hex')
    return this
  }
}
