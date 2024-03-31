import { BaseTransaction } from '@common/sign'
import * as Token from '@tokens/apt'

class Transaction extends BaseTransaction {
  /**
     * sign transaction
     * @param {string} txData - tx data
     * @param {array} privateKeys - private key array
     * @returns {object} - signed tx
     */
  async iSign (txData, privateKeys) {
    const tx = await new Token.Transaction().hbBuild(txData).hbSign(privateKeys)

    return {
      txhash: tx.hbGetTxHash(),
      output: tx.hbSerialize()
    }
  }
}

export default Transaction
