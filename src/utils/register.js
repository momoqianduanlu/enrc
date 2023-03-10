import { firstToUppercase } from '@/utils/index'
import { Field, Button, Form, Popup, DropdownMenu, DropdownItem } from 'vant'

// 全局注册组件
export function register (app) {
  const componentList = [Field, Button, Form, Popup, DropdownMenu, DropdownItem]
  componentList.forEach(comp => {
    const normalName = firstToUppercase(comp.name.slice(4))
    app.component(normalName, comp)
  })
}
