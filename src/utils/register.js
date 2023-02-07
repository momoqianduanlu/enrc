import { Field, Button } from 'vant'

// 全局注册组件
export function register (app) {
  app.use(Field)
  app.use(Button)
}
