<template>
  <div class="editorialArea">

    <quill-editor
      id="task-edit"
      class="myTextEditor"
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>

    <span style="float:right;margin-top:5px;margin-right:5px;font-size:12px;color:#999999">
      {{contentLength}} / 1000 字
      <a-divider type="vertical" />
      <span style="margin-left:0px">{{time}}</span>
    </span>

    <a-collapse class="editor-bar" :activeKey="String(editorPanel)" v-show="toolBar">
      <a-collapse-panel :forceRender="true" :disabled='true' key="true" :showArrow="false" >
        <div slot="header">
          <a-button class="editor-bar-button" type="link" @click.stop="revoke"><my-icon type="icon-undo-alt" /></a-button>
          <a-button class="editor-bar-button" type="link" @click="editorPanel=!editorPanel"><my-icon type="icon-font"/></a-button>
         
          <a-button class="editor-bar-button" style="float:right" type="link" @click.stop="cleanText">
            <my-icon type="icon-location-arrow"/>
          </a-button>
        </div>

        <div id="toolbar" class="toolbar">
          <a-row :gutter="20" justify="center">
            <a-col :span="8">
              <div class="editor-button-font">
                <button class="ql-bold" @click="selectMe(0)"></button>
              </div>
              <!-- <div class="editor-button-font">
                <select class="ql-color" value="color" style="margin-right: 5px" @change="selectColor($event)">
                  <option value="#000000"></option>
                  <option value="#e60000"></option>
                  <option value="#ff9900"></option> 
                  <option value="#008a00"></option> 
                  <option value="#0066cc"></option> 
                  <option value="#9933ff"></option>

                  <option value="#888888"></option>
                  <option value="#f06666"></option>
                  <option value="#ffc266"></option> 
                  <option value="#66b966"></option>
                  <option value="#66a3e0"></option>
                  <option value="#c285ff"></option>
                </select>
              </div> -->
            </a-col>
    
            <a-col :span="8">
              <div class="editor-button-font">
                <button class="ql-italic" @click="selectMe(1)"></button>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="editor-button-font">
                <button class="ql-strike" @click="selectMe(2)"></button>
              </div>
            </a-col>
            <div style="height:50px"></div>
            <a-col :span="10">
              <div class="editor-button-align">
                <button style="margin-left:5px;margin-right:5px" class="ql-align" value="" @click="selectMe(3)"></button>
                <button style="margin-left:5px;margin-right:5px" class="ql-align" value="center" @click="selectMe(4)"></button>
                <button style="margin-left:5px;margin-right:5px" class="ql-align" value="right" @click="selectMe(5)"></button>
              </div>
            </a-col>
            <a-col :span="8">
               <div class="editor-button">
                <button style="margin-left:5px;margin-right:5px" class="ql-list" value="bullet" @click="selectMe(6)"></button>
                <button style="margin-left:5px;margin-right:5px" class="ql-list" value="ordered" @click="selectMe(7)"></button>
              </div>
            </a-col>

            <a-col :span="6">
               <div class="editor-button">
                <button class="ql-blockquote" @click="selectMe(8)"></button>
              </div>
            </a-col>
          </a-row>
        </div>

      </a-collapse-panel>
    </a-collapse>

  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      color: 0,
      //富文本内容
      content: "",
      contentLength: 0,
      //富文本的按钮选择
      editorOption: {
        modules: {
          toolbar: "#toolbar",
        },
        placeholder: "写下这一刻的想法···",
        readOnly: false,
      },
      history:[],

      editorPanel: false,
      toolBar: true,
    };
  },
  computed: {
    time() {
      return moment().format("M/D H:m")
    }
  },
  mounted(){
    let icons = document.getElementsByClassName('icon');
    let color = 'fill:rgb(140, 194, 105)'
    icons[3].setAttribute("style", color)
  },
  methods: {
    selectMe(event){
      let icons = document.getElementsByClassName('icon');
      if(event>=3 && event<=5){
        for(let i=3;i<=5;i++){
          if(i==event) continue
          icons[i].setAttribute("style", 'fill:')
        }
      }
      if(event>=6 && event<=7){
        for(let i=6;i<=7;i++){
          if(i==event) continue
          icons[i].setAttribute("style", 'fill:')
        }
      }
      
      let color = icons[event].style.fill
      color = color === 'rgb(140, 194, 105)' ? '':'rgb(140, 194, 105)'
      let colorStyle = 'fill:' +  color
      icons[event].setAttribute("style", colorStyle)
    },

    selectColor(event){
      let icons = document.getElementsByClassName('icon');
      let color = 'fill:' +  event.target.value
      icons[0].setAttribute("style", color)
    },

    onEditorBlur() {
      //失去焦点事件
    },

    onEditorFocus() {
      //获得焦点事件
      this.$emit("fold");
      this.editorPanel = false;
      // this.toolBar = true;
    },

    onEditorChange(event) {
      event.quill.deleteText(1000,1);

      let tags = document.getElementsByClassName('ql-active')
      let icons = document.getElementsByClassName('icon');

      let classNames = []
      for(let i=0;i<tags.length;i++){
        classNames.push(tags[i].className)
      }

      if(classNames.indexOf('ql-list ql-active') == -1){
        icons[6].setAttribute("style", 'fill:')
        icons[7].setAttribute("style", 'fill:')
      }

      if(classNames.indexOf('ql-blockquote ql-active') == -1){
        icons[8].setAttribute("style", 'fill:')
      }else{
        icons[8].setAttribute("style", 'fill:rgb(140, 194, 105)')
      }

      // if(classNames.indexOf('ql-picker-label ql-active') == -1){
      //   icons[0].setAttribute("style", 'fill:')
      // }else{
      //   let colorPicker = tags[classNames.indexOf('ql-picker-label ql-active')]
      //   icons[0].setAttribute("style", 'fill:'+colorPicker.getAttribute('data-value'))
      // }

      //内容改变事件
      this.contentLength =this.$refs.myQuillEditor.quill.getLength() - 1
      this.$emit("richTextDataChange", this.content);
      this.history.push(this.content)
    },

    cleanText() {
      this.$emit("submit");
    },

    hintGetFun () {
      this.$nextTick(function () {
        this.$refs.myQuillEditor.quill.enable(true)
        this.$refs.myQuillEditor.quill.blur()
      })
    },

    revoke(){
      if (this.history.length >= 1) {
        let history = this.history.pop()
        history = this.history.pop()
        this.content = history
      }
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
  height: 320px;
}
.myTextEditor {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
}
.numofText {
  text-align: right;
  background-color: steelblue;
}
.editor-bar {
  position: fixed;
  width: 100%;
  z-index: 1005;
  font-size: 14px;
  left:0;
  bottom: 0;
}
.editor-button-font{
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  text-align: center;
  border-radius: 14px;
  background-color: rgba(0,0,0,0.03);
}

.editor-button{
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  text-align: center;
  border-radius: 14px;
  background-color: rgba(0,0,0,0.03);
}
.editor-button-align{
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border-radius: 14px;
  text-align: center;
  background-color: rgba(0,0,0,0.03);
}
.editor-bar-button{
  font-size: 20px;
}
.toolbar {
  margin: 0px;
  padding: 8px;
  border: 0px;
}
</style>
