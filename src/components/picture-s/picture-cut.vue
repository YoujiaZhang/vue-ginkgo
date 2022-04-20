<template>
  <div>
    <div style="text-align: center">
      <a-avatar
        style="border: 1px solid #d9d9d9"
        :src="headerUrl"
        :size="70"
        @click="edit"
      />
    </div>

    <a-modal
      title="头像上传"
      :forceRender="true"
      :visible="visible"
      :mask-closable="false"
      :confirm-loading="confirmLoading"
      :width="700"
      :footer="null"
      @cancel="cancelHandel"
    >
      <a-row>
        <a-col :xs="24" :md="12" :style="{ height: '250px',textAlign: 'center'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            outputType="jpeg"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            :canMoveBox="false"
            :centerBox="true"
            @realTime="realTime"
          >
          </vue-cropper>
        </a-col>
      </a-row>
      <slot name="progress"></slot>
      <a-row style="margin-top: 20px">
        <a-upload
          name="file"
          accept="image/*"
          :before-upload="beforeUpload"
          :show-upload-list="false"
        >
          <a-button icon="upload">选择图片</a-button>
          <a-button
            style="margin-left: 15px"
            icon="undo"
            @click.stop="rotateLeft"
          />
          <a-button
            style="margin-left: 15px"
            icon="redo"
            @click.stop="rotateRight"
          />
          <a-button
            style="margin-left: 15px"
            type="primary"
            @click.stop="finish('blob')"
            >保存</a-button
          >
        </a-upload>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "avatarModal",
  props: ["headerUrl"],
  data() {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      options: {
        img: this.headerUrl, // 需要剪裁的图片
        autoCrop: true,      // 是否默认生成截图框
        autoCropWidth: 200,  // 默认生成截图框的宽度
        autoCropHeight: 200, // 默认生成截图框的长度
        fixedBox: true,      // 是否固定截图框的大小 不允许改变
      },
      previews: {}, // 裁剪之后的结果
    };
  },
  methods: {
    edit(id) {
      this.visible = true;
      this.id = id;
    },
    close() {
      this.id = null;
      this.visible = false;
    },
    cancelHandel() {
      this.close();
    },
    
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },

    beforeUpload(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.options.img = reader.result;
      };
    },
    
    // 上传图片（点击保存按钮）
    finish() {
      this.$refs.cropper.getCropData((data) => {
        this.$emit("save", data, ()=>{
          this.visible = false;
        });
      });
    },
    // 裁剪之后的数据
    realTime(data) {
      this.previews = data;
    },
  }
};
</script>
<style scoped>
</style>