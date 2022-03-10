<template>
  <div class="form">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" @validate='validate'>
      <!-- 填写标题信息 -->
      <a-form-model-item ref="title" prop="title">
        <a-input
          v-model="form.title"
          placeholder="合适的标题更容易吸引别人的目光哦"
          @blur="
            () => {
              $refs.title.onFieldBlur();
            }
          "
          @change="formChange"
        >
          <div slot="addonBefore">标题</div>
        </a-input>
      </a-form-model-item>

      <!-- 填写联系人信息 -->
      <!-- <a-form-model-item
        ref="contactPerson"
        prop="contactPerson"
        v-show="!inputDisabled"
      >
        <a-input
          style="width: 100%"
          v-model="form.contactPerson"
          placeholder="您的姓名"
          :disabled="inputDisabled"
          @blur="
            () => {
              $refs.contactPerson.onFieldBlur();
            }
          "
        >
          <div slot="addonBefore">怎么称呼</div>
        </a-input>
      </a-form-model-item>

      <a-form-model-item v-show="inputDisabled">
        <a-input placeholder="匿了匿了" :disabled="inputDisabled">
          <div slot="addonBefore">咱不留名</div>
        </a-input>
      </a-form-model-item> -->

      <!-- 填写联系方式信息 -->
      <!-- <a-form-model-item
        ref="contactInformation"
        prop="contactInformation"
        v-show="!inputDisabled"
      >
        <a-input-group compact>
          <a-select
            default-value="QQ"
            style="width: 20%"
            :disabled="inputDisabled"
          >
            <a-select-option value="QQ">QQ</a-select-option>
            <a-select-option value="微信">微信</a-select-option>
            <a-select-option value="电话">电话</a-select-option>
          </a-select>
          <a-input
            style="width: 80%"
            placeholder="请输入您的联系方式"
            v-model="form.contactInformation"
            :disabled="inputDisabled"
            @blur="
              () => {
                $refs.contactInformation.onFieldBlur();
              }
            "
          />
        </a-input-group>
      </a-form-model-item> -->
    </a-form-model>

    <!-- <a-form-model-item v-show="inputDisabled">
      <a-input-group compact>
        <a-select
          default-value="QQ"
          style="width: 20%"
          :disabled="inputDisabled"
        ></a-select>
        <a-input
          style="width: 80%"
          placeholder="匿了匿了"
          :disabled="inputDisabled"
        />
      </a-input-group>
    </a-form-model-item> -->
<!-- 
    <a-checkbox class="check-box" :checked="checkNick" @change="handleChange">
      <span>是否留下联系方式 ? </span>
      <a-icon type="phone" theme="twoTone" v-show="!inputDisabled" />
      <my-icon type="icon-anonymous-full" v-show="inputDisabled" />
    </a-checkbox> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      other: "",
      formx: this.$form.createForm(this, { name: "dynamic_rule" }),
      form: {
        contactInformation: "",
        contactPerson: "",
        title: "",
      },
      // 表单的输入规则
      rules: {
        contactPerson: [
          {
            required: true,
            message: "请填写联系人信息",
            trigger: "blur",
          },
          {
            min: 0,
            max: 10,
            message: "10个字以内",
            trigger: "blur",
          },
        ],
        contactInformation: [
          {
            required: true,
            message: "请输入您的联系方式",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入标题，或者关键字",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "请控制标题为2~10个字",
            trigger: "blur",
            hasFeedback: true,
          },
        ],
      },
      checkNick: true,
      inputDisabled: false,
    };
  },
  methods: {
    formChange(){
      this.$emit('formDataChange',this.form);
      // console.log('表格数据修改',this.form)
    },
    handleChange(e) {
      this.inputDisabled = this.inputDisabled ? false : true;
      this.checkNick = e.target.checked;
      this.rules.contactPerson[0].required = this.inputDisabled ? false : true;
    },
    validate(source, options, message){
      this.$emit('valueValid',{source:source, options:options, message:message});
    }
  },
};
</script>

<style scoped>
.form {
  margin-left: 5%;
  margin-right: 5%;
}
.contactPerson {
  width: 100%;
  padding: 10px;
  padding-top: 10px;
}
.contactPersonInput {
  width: 10%;
}
</style>