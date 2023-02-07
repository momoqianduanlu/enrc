<script>
import { defineComponent, onMounted, onBeforeUnmount, reactive } from 'vue'
import { showNotify, closeNotify } from 'vant'
import { BrowserMultiFormatReader } from '@zxing/library'

export default defineComponent({
  name: 'qr-code',
  emits: ['getQrCode'],
  setup (props, ctx) {
    const form = reactive({
      scanText: ''
    })
    const codeReader = reactive(new BrowserMultiFormatReader())
    // 打开扫码
    const openScan = async () => {
      codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
          showNotify({ type: 'primary', message: '正在调用摄像头...' })
          console.log('videoInputDevices', videoInputDevices)
          // 默认获取第一个摄像头设备id
          let firstDeviceId = videoInputDevices[0].deviceId
          // 获取第一个摄像头设备的名称
          const videoInputDeviceslablestr = JSON.stringify(
            videoInputDevices[0].label
          )
          if (videoInputDevices.length) {
            // 判断是否后置摄像头
            if (videoInputDeviceslablestr.indexOf('back') > -1) {
              firstDeviceId = videoInputDevices[0].deviceId
            } else {
              firstDeviceId = videoInputDevices[1].deviceId
            }
          }
          decodeFromInputVideoFunc(firstDeviceId)
        })
        .catch((err) => {
          closeNotify()
          console.log(`失败出错： ${err}`)
        })
    }
    // 开始解码
    const decodeFromInputVideoFunc = (firstDeviceId) => {
      codeReader.reset()
      form.scanText = ''
      codeReader.decodeFromInputVideoDeviceContinuously(
        firstDeviceId,
        'video',
        (result, err) => {
          if (result) {
            form.scanText = result.text
            console.log('扫描结果', result)
            if (form.scanText) {
              closeNotify()
              ctx.emit('getQrCode', form.scanText)
            }
          }
          if (err && !err) {
            showNotify({ type: 'primary', message: '识别失败' })
            setTimeout(() => {
              closeNotify()
            }, 1000)
            console.error(err)
          }
        }
      )
    }

    onMounted(() => {
      openScan()
    })

    onBeforeUnmount(() => {
      codeReader.reset()
    })

    return {}
  },
  render () {
    return <>
      <div class="QrCode">
        <video ref="video" height="100%" width="100%" id="video" autoplay></video>
      </div>
      <div class="Qr_scanner">
        <div class="box">
          <div class="line_row">
            <div class="line"></div>
          </div>
          <div class="angle"></div>
        </div>
      </div>
    </>
  }
})
</script>

<style scoped lang="scss">
.QrCode {
  width: 100vw;
  height: 100vh;
  position: relative;

  #video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 二维码动画
.Qr_scanner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  // position: relative;
  background-color: rgba(0, 0, 0, 0.5);
}

.Qr_scanner .box {
  width: 75vw;
  height: 75vw;
  max-height: 75vh;
  max-width: 75vh;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // overflow: hidden;
  border: 1px solid rgb(43, 113, 254);

  .line_row {
    width: 100%;
    overflow: hidden;
    background-image: linear-gradient(0deg,
        transparent 24%,
        rgba(136, 176, 255, 0.1) 25%,
        rgba(136, 176, 255, 0.1) 26%,
        transparent 27%,
        transparent 74%,
        rgba(136, 176, 255, 0.1) 75%,
        rgba(136, 176, 255, 0.1) 76%,
        transparent 77%,
        transparent),
      linear-gradient(90deg,
        transparent 24%,
        rgba(136, 176, 255, 0.1) 25%,
        rgba(136, 176, 255, 0.1) 26%,
        transparent 27%,
        transparent 74%,
        rgba(136, 176, 255, 0.1) 75%,
        rgba(136, 176, 255, 0.1) 76%,
        transparent 77%,
        transparent);
    background-size: 3rem 3rem;
    background-position: -1rem -1rem;
    animation: Heightchange 2s infinite;
    animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
    animation-delay: 1.4s;
    border-bottom: 1px solid rgba(136, 176, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
}

.Qr_scanner .line {
  // height: calc(100% - 2px);
  // width: 100%;
  // background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #2b71fe 211%);
  // border-bottom: 3px solid #2b71fe;
  // transform: translateY(-100%);
  // animation: radar-beam 2s infinite;
  // animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  // animation-delay: 1.4s;
  width: 100%;
  height: 3px;
  background: #2b71fe;
  // opacity: 0.58;
  filter: blur(4px);
}

.Qr_scanner .box:after,
.Qr_scanner .box:before,
.Qr_scanner .angle:after,
.Qr_scanner .angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 78px;
  height: 78px;
  border: 0.3rem solid transparent;
}

.Qr_scanner .box:after,
.Qr_scanner .box:before {
  top: -7px;
  border-top-color: #2b71fe;
}

.Qr_scanner .angle:after,
.Qr_scanner .angle:before {
  bottom: -7px;
  border-bottom-color: #2b71fe;
}

.Qr_scanner .box:before,
.Qr_scanner .angle:before {
  left: -7px;
  border-left-color: #2b71fe;
}

.Qr_scanner .box:after,
.Qr_scanner .angle:after {
  right: -7px;
  border-right-color: #2b71fe;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes Heightchange {
  0% {
    height: 0;
  }

  100% {
    height: 100%;
  }
}
</style>
