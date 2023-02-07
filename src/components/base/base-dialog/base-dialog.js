import { createApp } from 'vue'

// 子类继承该类 实现单例弹框api
export const createMyApp = (comp, props = {}) => {
  return createApp(comp, props)
}

// export const showInstance = () => {
//   return new Promise((resolve, reject) => {
//     this.popup = this.createMyApp()
//     this.root = document.createElement('div')
//     document.body.appendChild(this.root)
//     this.popupInstance = this.popup.mount(this.root)
//     // eslint-disable-next-line no-undef
//     this.popupInstance.show(param).then((json) => {
//       this.hide()
//       resolve(json)
//     }).catch((err) => {
//       this.hide()
//       reject(err)
//     })
//   })
// }
