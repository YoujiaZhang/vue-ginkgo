# vue-ginkgo

**Vue2**

## 相关配置
```
├── @tinymce/tinymce-vue@3.2.8
├── @vue/cli-plugin-babel@4.5.15
├── @vue/cli-plugin-eslint@4.5.15
├── @vue/cli-service@4.5.15
├── ant-design-vue@1.7.8
├── axios@0.25.0
├── babel-eslint@10.1.0
├── babel-plugin-import@1.13.3
├── buefy@0.9.14
├── clipboard@2.0.10     // 复制文案到剪贴板
├── core-js@3.20.3
├── cos-js-sdk-v5@1.3.5  // 腾讯云COS
├── eslint-plugin-vue@6.2.2
├── eslint@6.8.0
├── exif-js@2.3.0
├── less-loader@5.0.0
├── less@2.7.3
├── mockjs@1.1.0
├── moment@2.29.1
├── reqwest@2.0.5   // 准备放弃使用
├── tinymce@5.10.2 
├── vant@2.12.39
├── vue-cropper@0.5.8
├── vue-infinite-scroll@2.0.2
├── vue-quill-editor@3.0.6
├── vue-router@3.5.3
├── vue-template-compiler@2.6.14
├── vue-touch@2.0.0-beta.4
├── vue-wxlogin@1.0.4
├── vue@2.6.14
├── vuex@3.6.2
└── weixin-js-sdk@1.6.0
```

## 简要说明
- `assets` 图片资源入口，不常修改数据 常量数据
- `components` 所有组件。包括原子组件、业务公用组件、页面独有组件
- `pages` 所有路由页面。原则：轻page，重component
- `plugins` 自己或第三方插件,包括但不限于 components、directives、filters、third lib
- `router.js` 路由划分
- `store` 标准vuex格式，非必须

- `main.js`主入口
