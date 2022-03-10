# Vue规范

## 文件命名
统一小写，多个单词作为文件名使用分隔符
```
// bad
EntityList.vue
entityList.vue

// good
entity-list.vue
```

## 紧密耦合的组件命名
和父组件紧密耦合的子组件应该以父组件名作为前缀命名
```
// bad
components/
|- todo-list.vue
|- todo-item.vue
└─ todo-button.vue

// good
components/
|- todo-list.vue
|- todo-list-item.vue
└─ todo-list-item-button.vue
```

## 自闭合组件自闭合组件
在单文件组件中没有内容的组件应该是自闭合的
```
<!-- bad -->
<u-input></u-input>

<!-- good -->
<u-input />
```

## 指令缩写
用: 表示 v-bind: ，用@表示v-on
```
<!-- bad -->
<input v-bind:value="value" v-on:input="onInput">

<!-- good -->
<input :value="value" @input="onInput">
```

## 组件数据
组件的 data 必须是一个函数,并且建议在此不使用箭头函数
```
// bad
export default {
  data: () => ({
    foo: 'bar'
  })
}

// good
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

## props命名
小驼峰命名。内容尽量详细，至少有默认值
```
// bad
greeting-text: String

// good
greetingText: { type: String, default: ''}
```

## 组件属性顺序和分行规则

顺序原则：重要属性放前面

顺序依据：依次指令->props属性-> 事件->dom属性(class有标记作用，除外)

分行规则：放在一行，重要内容较多时，可放置2～3行

```
<!-- bad -->
<u-select
    class="select"
    size="s"
    @select="searchEntity($event, row)"
    @blur="searchEntity($event, row)"
    v-model="row.variableId"
    :list="variableList" />

<!-- good -->
<u-select v-model="row.variableId" :list="variableList" size="s"
    @select="searchEntity($event, row)" @blur="searchEntity($event, row)" class="select" />
```

## Vue API顺序
```
export default {
    name: '',
    /*1. Vue扩展 */
    extends: '', // extends和mixins都扩展逻辑，需要重点放前面
    mixins: [],   
    components: {},
    /* 2. Vue数据 */
    props: {},
    model: { prop: '', event: '' }, // model 会使用到 props
    data () {
        return {}
    },
    computed: {},
    watch:{}, // watch 监控的是 props 和 data，有必要时监控computed
    /* 3. Vue资源 */
    filters: {},
    directives: {},
    /* 4. Vue生命周期 */
    created () {},
    mounted () {},
    destroy () {},
    /* 5. Vue方法 */
    methods: {}, // all the methods should be put here in the last
}
```

## Vue组件顶级标签顺序
顺序保持一致，且标签之间留有空行。template第一层级下四个空格，script和style第一层级都不加空格
```
<template>
    <div></div>
</template>

<script>
export default {}
</script>

<style>
.app {}
</style>
```