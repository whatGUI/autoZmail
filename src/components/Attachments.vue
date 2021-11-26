<template>
  <div class="Attachments">
    <el-switch
      class="mode-switch"
      v-model="pathType"
      active-text="仅使用默认文件夹"
      inactive-text="手动选择文件"
      active-value="folder"
      inactive-value="files"
      @change="switchClick"
    ></el-switch>

    <el-upload
      class="upload"
      action="localhost"
      drag
      multiple
      :auto-upload="false"
      :on-change="addFile"
      :on-remove="removeFile"
      :file-list="fileList"
      v-show="pathType === 'files'"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>手动选择</em>
      </div>
    </el-upload>

    <el-input
      placeholder="请选择默认文件夹"
      v-model="defaultFolder"
      class="input-with-select"
      spellcheck="false"
      :readonly="true"
      v-show="pathType === 'folder'"
    >
      <template slot="prepend">默认文件夹</template>
      <el-button @click="selectFolder" slot="append" icon="el-icon-folder-opened"></el-button>
    </el-input>

    <el-alert
      class="alert-box"
      title="注意"
      description="程序会尝试发送默认文件夹内的所有文件，发送前最好确认一下里面的文件"
      type="warning"
      show-icon
      close-text="不再提示"
      v-show="pathType==='folder' && isAlert"
      @close="saveAlertStatus"
    ></el-alert>
  </div>
</template>

<script>
export default {
  name: "Attachments",
  props: {
    clearFilesDir: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      fileList: [],
      defaultFolder: "",
      pathType: 'files',
      isAlert: true,
    };
  },
  components: {},
  watch: {
    clearFilesDir: function (val) {
      if (val === true) {
        localStorage.setItem('filesDir', JSON.stringify([]))
        this.fileList = []
      }
    },
  },
  methods: {
    selectFolder() {
      window.ipcRenderer.invoke("get-folder-dir").then((result) => {
        if (result.canceled === false) {
          this.defaultFolder = result.filePaths[0]
          localStorage.setItem('folder', this.defaultFolder)
        }
      });
    },
    addFile(file) {
      const fileInfo = {};
      fileInfo.name = file.name;
      fileInfo.status = "success";
      fileInfo.path = file.raw.path;
      this.fileList.push(fileInfo);
      this.saveFilesDir()
    },
    removeFile(file) {
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
      this.saveFilesDir()
    },
    saveFilesDir() {
      const filesDir = []
      this.fileList.forEach(element => {
        filesDir.push(element.path)
      })
      localStorage.setItem('filesDir', JSON.stringify(filesDir))
    },
    saveAlertStatus() {
      this.isAlert = false
      localStorage.setItem('isAlert', false)
    },
    switchClick(val) {
      if (val === 'folder') {
        localStorage.setItem('filesDir', JSON.stringify([]))
        this.fileList = []
      }
      localStorage.setItem('pathType', val)
    },
    initPageStatus() {
      if (localStorage.getItem('folder')) {
        this.defaultFolder = localStorage.getItem('folder')
      } else {
        localStorage.setItem('folder', '')
      }

      if (localStorage.getItem('isAlert') !== null) {
        this.isAlert = JSON.parse(localStorage.getItem('isAlert'))
      } else {
        localStorage.setItem('isAlert', true)
      }

      if (localStorage.getItem('pathType')) {
        this.pathType = localStorage.getItem('pathType')
      } else {
        localStorage.setItem('pathType', 'files')
      }

      localStorage.setItem('filesDir', JSON.stringify([]))
    },
  },
  mounted() {
    this.initPageStatus()
  },
};
</script>

<style scoped>
.Attachments {
  text-align: center;
}
.mode-switch {
  margin-bottom: 20px;
}
.input-with-select {
  margin-top: 150px;
}
</style>
