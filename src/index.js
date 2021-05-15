import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import './g2'
import './rollbar'
import browserHistory from 'history/createBrowserHistory'
import './index.less'
import router from './router'
import { message } from 'antd'

// 1. Initialize
const app = dva({
  history: browserHistory(),
  onError: () => {
    message.error('')
  }
})

// 2. Plugins
app.use(createLoading({
  effects: true,
}))

// 3. Register global model
app.model(require('./models/app'))

// 4. Router
app.router(router)

// 5. Start
app.start('#root')

