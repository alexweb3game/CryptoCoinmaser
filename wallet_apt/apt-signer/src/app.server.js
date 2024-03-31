import { BaseAppServer } from '@common/sign'
import TransactionCls from './transaction'

class AppServer extends BaseAppServer {
  init () {
    this.chain = 'apt'
    this.Transaction = TransactionCls
  }
}

const app = new AppServer()
app.start()
