<template>
  <div id="app">
    <title-bar></title-bar>
    <el-container>
      <el-header>
        <nav-bar @navClick="navClick" @sendEmail="sendEmail" :sending="isSending" />
      </el-header>
      <el-main>
        <keep-alive>
          <component :is="currentView" :clearFilesDir="clearFilesDir"></component>
        </keep-alive>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Attachments from './components/Attachments.vue';
import EmailConfig from './components/EmailConfig.vue';
import NavBar from "./components/NavBar.vue";
import TitleBar from './components/TitleBar.vue';

export default {
  name: "App",
  components: {
    NavBar,
    EmailConfig,
    Attachments,
    TitleBar,
  },
  data() {
    return {
      currentView: 'EmailConfig',
      viewList: {
        1: 'EmailConfig',
        2: 'Attachments',
      },
      isSending: false,
      clearFilesDir: false,
    };
  },
  methods: {
    navClick(key) {
      this.currentView = this.viewList[key]
    },
    sendEmail() {
      this.isSending = true
      const data = this.getEmailData()
      if (data) {
        window.ipcRenderer.invoke("send-email", data)
          .then((result) => {
            if (result.status === 'success') {
              this.$notify.success({
                title: '成功',
                message: '邮件已经发送完成',
                position: 'bottom-right'
              })
              this.clearFilesDir = true
            }
            else (
              this.$notify.error({
                title: '错误',
                message: result.error
              })
            )
          })
          .then(() => this.isSending = false)
      }
      else {
        this.isSending = false
      }
    },
    getEmailData() {
      const pathType = localStorage.getItem('pathType')
      const emailConfig = JSON.parse(localStorage.getItem('emailConfig'))

      if (!pathType) {
        this.$notify.error({
          title: '错误',
          message: '请添加附件后再发送'
        })
        return
      }

      if (pathType === 'files') {
        const filesDir = JSON.parse(localStorage.getItem('filesDir'))
        if (filesDir.length === 0) {
          this.$notify.error({
            title: '错误',
            message: '手动选择文件为空，请重新添加后再试'
          })
          return
        }
        const attachments = { filesDir, pathType }
        return { emailConfig, attachments }
      }

      if (pathType === 'folder') {
        const folder = localStorage.getItem('folder')
        if (!folder) {
          this.$notify.error({
            title: '错误',
            message: '没有设置默认文件夹'
          })
          return
        }
        const attachments = { folder, pathType }
        return { emailConfig, attachments }
      }
    },
    initPageStatus() {
      if (localStorage.getItem('activeIndex')) {
        this.currentView = this.viewList[localStorage.getItem('activeIndex')]
      }
    },
  },
  mounted() {
    this.initPageStatus()
  },
}
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-upload-dragger {
  height: 50vh;
  width: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.el-upload-dragger .el-icon-upload {
    margin: 0 0 16px;
}
</style>
