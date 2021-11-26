<template>
  <div class="EmailConfig">
    <el-form
      class="config-form"
      ref="configForm"
      :model="configForm"
      label-width="100px"
      label-position="top"
      size="mini"
      :rules="formRules"
      :hide-required-asterisk="true"
    >
      <el-row type="flex" :gutter="40" justify="space-around">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              placeholder="请输入邮箱"
              v-model="configForm.email"
              spellcheck="false"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="configForm.password"
              show-password
              spellcheck="false"
            />
          </el-form-item>

          <el-form-item label="SMTP服务器" prop="host">
            <el-input
              type="text"
              placeholder="请输入SMTP服务器"
              v-model="configForm.host"
              clearable
              spellcheck="false"
            />
          </el-form-item>

          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <el-form-item label="端口" prop="port">
                <el-input placeholder="端口号" v-model.number="configForm.port" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="开启TLS加密" prop="secure">
                <el-switch v-model="configForm.secure"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col class="right-form" :span="12">
          <el-form-item label="收件人" prop="to">
            <el-input
              type="email"
              placeholder="收件人"
              v-model="configForm.to"
              clearable
              spellcheck="false"
            />
          </el-form-item>

          <el-form-item label="主题" prop="subject">
            <el-input type="text" placeholder="主题" v-model="configForm.subject" clearable />
          </el-form-item>

          <el-form-item label="正文" prop="text">
            <el-input type="textarea" placeholder="请输入正文内容" v-model="configForm.text" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="button-wrapper">
      <el-button class="save-button" type="primary" @click="saveToStorage">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmailConfig",
  data() {
    return {
      configForm: {
        email: '',
        password: '',
        host: '',
        port: 587,
        secure: false,
        to: '',
        subject: '',
        text: ''
      },
      formRules: {
        port: [
          { required: true, message: "端口号不能为空" },
          { type: "number", message: "端口号必须为数字值" },
        ],
        email: [
          { required: true, message: "邮箱不能为空" },
          { type: "email", message: "邮箱格式错误" },
        ],
        password: [{ required: true, message: "密码不能为空" }],
        host: [{ required: true, message: "SMTP服务器地址不能为空" }],
        to: [{ required: true, message: "收件人不能为空" }],
        subject: [{ required: true, message: "主题不能为空" }],
        text: [{ required: true, message: "正文不能为空" }],
      },
    };
  },
  methods: {
    saveToStorage() {
      this.$refs.configForm
        .validate()
        .then(() => {
          localStorage.setItem("emailConfig", JSON.stringify(this.configForm));
          this.$message.success('保存成功！')
        });
    },
  },
  mounted() {
    if (localStorage.getItem('emailConfig')) {
      this.configForm = JSON.parse(localStorage.getItem('emailConfig'))
    }
  },
};
</script>

<style scoped>
.right-form {
  border-left: 1px solid rgb(220, 223, 230);
}
.button-wrapper {
  width:100%;
  height: 40px;
  text-align: center;
}
.save-button {
  margin-top:20px;
}
</style>
