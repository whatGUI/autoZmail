<template>
  <div class="NavBar">
    <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item class="nav-item" index="1">
        <i class="el-icon-setting"></i>
        <span>邮箱设置</span>
      </el-menu-item>
      <el-menu-item class="nav-item" index="2">
        <i class="el-icon-document-add"></i>
        <span>添加附件</span>
      </el-menu-item>
    </el-menu>

    <el-button
      class="el-button"
      type="primary"
      icon="el-icon-message"
      :loading="sending"
      round
      @click="handleSend"
      v-loading.fullscreen.lock="sending"
      element-loading-text="拼命发送中..."
    >{{ sending ? '发送中' : '打包并发送' }}</el-button>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    sending: {
      default: false,
      required: true
    }
  },
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key) {
      this.$emit("navClick", key);
      console.log("index：",key);
      localStorage.setItem('activeIndex',key)
    },
    handleSend() {
      this.$emit('sendEmail')
    },
  },
  mounted() {
    if(localStorage.getItem('activeIndex')){
      this.activeIndex = localStorage.getItem('activeIndex')
    }
  },
};
</script>

<style scoped>
.NavBar {
  position: relative;
}
.nav-item {
  user-select: none;
}
.el-button {
  position: absolute;
  right: 20px;
  top: 15px;
}
</style>
