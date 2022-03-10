<template>
  <div class="editorialArea">
    <div id="toolbar" slot="toolbar" class="toolbar">
      <button class="ql-clean" style="margin-right: 0px"></button>
      <button class="ql-bold"></button>
      <button class="ql-strike"></button>
      
      <select class="ql-color" value="color" style="margin-right: 10px">
<!--         
        <option value="#000000"></option>
        <option value="#e60000"></option>
        <option value="#ff9900"></option> 
        <option value="#0066cc"></option> 
        <option value="#9933ff"></option>
        -->
      </select>

      <!-- <button class="ql-blockquote"></button> -->
      <!-- <button class="ql-code-block" style="margin-right: 10px"></button> -->

      <button class="ql-list" value="ordered" title="有序列表"></button>

      <button
        class="ql-list"
        style="margin-right: 10px"
        value="bullet"
        title="无序列表"
      ></button>

      <!-- <button class="ql-image"></button> -->

      <!-- <div>
        <van-divider
          :style="{
            color: '#fff',
            borderColor: '#fff',
            padding: '0 0px',
          }"
        >
        </van-divider>
      </div> -->

      <!-- <button style="margin-right: 0px" @click="rollback">
        <my-icon type="icon-chexiao" style="width: 18px; height: 18px" />
      </button> -->

      <button style="float: right" @click="cleanText">
        <my-icon type="icon-qingkong" style="width: 18px; height: 18px" />
      </button>
    </div>

    <quill-editor
      id="task-edit"
      class="myTextEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <!-- <span>{{ content }}</span> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: 0,
      //富文本内容
      content: "",
      //富文本的按钮选择
      editorOption: {
        modules: {
          toolbar: "#toolbar",
        },
        placeholder: "写下这一刻的想法···",
        readOnly: false,
      },
    };
  },
  methods: {
    onEditorBlur() {
      //失去焦点事件
      // console.log("失去焦点事件");
    },
    onEditorFocus() {
      //获得焦点事件
      // console.log("获得焦点事件", e);
      this.contentKey = true;
    },
    onEditorChange() {
      //内容改变事件
      this.$emit("richTextDataChange", this.content);
    },
    cleanText() {
      this.content = "";
    },
  },
};
</script>

<style scoped>
.editorialArea {
  margin-top: 15px;
  margin-left: 5%;
  margin-right: 5%;
  width: 90%;
  height: 280px;
}
.myTextEditor {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  /* text-align: center; */
}
.toolbar {
  margin: 0px;
  padding: 0px;
  text-align: center;
  /* border-radius: 10px; */
  /* background-color: cadetblue; */
}
.numofText {
  text-align: right;
  background-color: steelblue;
}
</style>