import BaseDialog from './index.vue'
import { createMyApp } from './base-dialog.js'

let instance = null

const ShowDialog = () => {
  if (!instance) {
    instance = {
      dialogInstance: null,
      dialogApp: null,
      el: null,
      show (params) {
        return new Promise((resolve, reject) => {
          if (!this.dialogInstance) {
            this.dialogApp = createMyApp(BaseDialog, params)
            this.el = document.createElement('div')
            document.body.appendChild(this.el)
            this.dialogInstance = this.dialogApp.mount(this.el)
          }
          // debugger
          this.dialogInstance.show().then((json) => {
            this.hide()
            resolve(json)
          }).catch((err) => {
            this.hide()
            reject(err)
          })
        })
      },
      clear () {
        if (this.dialogInstance) {
          this.dialogInstance.hide()
          this.popup.unmount()
          document.body.removeChild(this.el)
          this.dialogInstance = null
        }
      },
      hide () {
        if (this.dialogInstance) {
          this.dialogInstance.hide()
        }
      }
    }
  }
  return instance
}
const showDialog = ShowDialog

export {
  showDialog
}
