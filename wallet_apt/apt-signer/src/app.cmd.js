import { BaseAppCmd } from '@common/sign'
import AccountCls from './account'

class AppCmd extends BaseAppCmd {
  init () {
    this.chain = 'apt'
    this.Account = AccountCls
  }
}

const app = new AppCmd()
app.start()
