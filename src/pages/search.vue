<template>
  <div>
    <a-spin tip="加载中 ···" :spinning="!searcheEnd">
      <a-anchor>
        <van-search
          v-model="keyword"
          placeholder="请输入搜索关键词"
          show-action
          shape="round"
          @search="onSearch"
          @cancel="onCancel"

          @focus="searchFocus"
          @blur="searchBlur"
          @input="searchInput"
        />

        <div>
          <a-card class="search-history" :bordered="false" v-show="showSearchHistory">
            <a-card-meta>
              <div style="font-size: 16px" slot="title">
                <span style="line-height: 20px;font-weight: 600">搜索历史</span>
                <a-icon
                  style="float: right;margin-right:5px"
                  type="delete"
                  theme="twoTone" two-tone-color="#8cc269"
                  @click="closeState = closeState === true ? false : true"
                />
              </div>

              <div slot="description">
                <template v-for="tag in searchList">
                  <a-tag
                    class="search-tag"
                    :key="tag"
                    :closable="closeState"
                    @click="tagClick(tag)"
                    @close="deleteTag(tag)"
                    @blur="closeState = false"
                    >{{ tag }}</a-tag
                  >
                </template>
              </div>
            </a-card-meta>
          </a-card>
        </div>
      </a-anchor>

      <div
        class="infinite-container"
        v-infinite-scroll="loadMorePost"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list :data-source="post" :locale="postEmtpy">

          <!-- 列表的footer部分 -->
          <a-list-item slot="footer" v-show="post.length != 0">
            <div
              style="margin-top:15px;margin-bottom:150px;width: 100%;text-align: center;"
            >
              <span v-show="!loading" style="color: #888888; font-size: 12px">
                - THE END -
              </span>
              <a-spin v-show="loading" tip="加载中..."></a-spin>
            </div>
          </a-list-item>
          
          <!-- 搜索出来的帖子 -->
          <a-list-item slot="renderItem" slot-scope="msg">
            <home-post-item
              class="post-item-summary"
              :userID="msg.user.id"
              :postID="msg.post.id"

              :postTitle="msg.post.title"
              :postContent="msg.post.content"
              :postPictures="msg.post.picUrls"
              :postReleaseTime="CONST.getDiffTime(msg.post.createTime)"

              :postComments="msg.post.commentCount"
              :postViews="msg.post.viewCount"
              :postLikes="msg.post.likeCount"
              :postLikeStatus="msg.likeStatus"
              
              :authorName="msg.user.username"
              :authorLevel="msg.user.level"
              :authorAvatar="msg.user.headerUrl"
            ></home-post-item>
          </a-list-item>
        </a-list>
      </div>
    </a-spin>
  </div>
</template>

<script>
import homePostItem from "../components/home-s/home-post-item.vue";
import dataListEmpty from "../components/empty-s/empty-list-state.vue";
import infiniteScroll from "vue-infinite-scroll";

import CONST from "../assets/const";
import axios from "../plugins/Axios"

export default {
  directives: { infiniteScroll },
  components: { homePostItem },
  data() {
    return {
      CONST,
      busy: false,
      loading: false,

      post: [],
      current: 1,
      postNum: 0,

      postEmtpy: {
        emptyText: (
          <dataListEmpty
            text="发现有趣"
            imgStr={require("@/assets/images/searchEmpty.png")}
          />
        ),
      },

      searchEmtpy: {
        emptyText: (
          <dataListEmpty
            text="什么都没找到啊T T"
            imgStr={require("@/assets/images/searchEmpty.png")}
          />
        ),
      },

      keyword: "",  //输入的关键词
      searchList: [], // 历史关键词数组

      showSearchHistory: true, // 是否展示搜索历史
      closeState: false, // tag的关闭状态
      searcheEnd: true,  // 搜索是否完成
    };
  },
  created() {
    // 搜索历史存储在浏览器的本地存储中
    // 首先是读取存储的历史搜索关键词
    this.searchList = JSON.parse(localStorage.getItem("keyword")) || []; 

    // 如果网页的URL包含了关键词，那就把这kw提取出来 完成搜索
    var keyword = decodeURI(window.location.href.split('?keyword=')[1])
    if(keyword != '' && keyword != 'undefined'){
      this.keyword = decodeURI(window.location.href.split('?keyword=')[1])
      // 搜索
      this.onSearch() 
    }
  },
  methods: {
    tagClick(tag){
      // 点击关键词标签的时候 同时完成搜索
      this.keyword = tag
      this.onSearch()
    },

    deleteTag(kw) {
      // 点击tag的叉号，从搜索历史中删除这个关键词
      let searchListCopy = [];
      let index = 0;

      for (var item in this.searchList) {
        if (kw === this.searchList[item]) continue;
        searchListCopy[index] = this.searchList[item];
        index += 1;
      }
      this.searchList = searchListCopy
      localStorage.setItem("keyword", JSON.stringify(searchListCopy));
    },

    searchFocus(){
      // 搜索输入框聚焦
      this.$store.dispatch("edKeyChange", false);
      
      if(this.post.length==0){
        this.showSearchHistory = true
      }else{
        this.showSearchHistory = false
      }
    },
    searchBlur(){
      // 搜索输入框失焦
      this.$store.dispatch("edKeyChange", true);
    },
    searchInput(){
      // 搜索输入框内容改变的时候
      this.post = []
      this.showSearchHistory = true
    },

    onCancel() {
      this.$router.go(-1);
    },
    onSearch() {
      // 每次重新搜索的时候都需要重新设置 current 为 1
      this.current = 1

      // 去除关键词中包含的头和尾的空格
      this.keyword = this.keyword.replace(/(^\s*)|(\s*$)/g, "")
      if (!this.keyword) {
        return;
      }
      
      history.replaceState(null, null, 
        window.location.href.split('?keyword=')[0] +
        '?keyword=' + 
        this.keyword
      )
      
      this.searcheEnd = false;
      if (this.searchList.indexOf(this.keyword) === -1) {
        this.searchList.unshift(this.keyword);
        this.searchList = this.searchList.slice(0, 10);
        localStorage.setItem("keyword", JSON.stringify(this.searchList));
      }

      this.fetchPostData((res) => {
        if (res.code == "200"){
          if (res.msg.discussPosts.length != 0) {
            this.current += 1;
          }

          this.post = res.msg.discussPosts;
          this.postEmtpy = this.searchEmtpy;
        }

        this.searcheEnd = true
        this.showSearchHistory = false
        this.$store.dispatch("edKeyChange", true);
      });
    },

    fetchPostData(callback) {
      axios({
        url: "/discuss/search",
        method: "POST",
        params: {
          keyword: this.keyword,
          current: this.current,
        },
      })
      .then(function (response) {
        callback(response.data);
      });
    },

    loadMorePost() {
      if (this.loading == true || this.searcheEnd) {
        return;
      }

      const data = this.post;
      this.loading = true;

      this.fetchPostData((res) => {
        if (res.msg.discussPosts.length == 0) {
          this.busy = true;
          this.loading = false;
          this.searcheEnd = true;
          return;
        }

        if (res.msg.discussPosts.length != 0 && this.loading) {
          this.current += 1;
        }
        this.post = data.concat(res.msg.discussPosts);
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.infinite-container {
  width: 100%;
}
.backtop-button {
  float: right;
  bottom: 170px;
  right: 5%;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
}
.backtop-button:hover {
  color: rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.05);
  border: 0px solid rgba(0, 0, 0, 0.1);
}
.backtop-button:active {
  background-color: rgba(0, 0, 0, 0.05);
  border: 0px solid rgba(0, 0, 0, 0.1);
}
.backtop-button-icon {
  font-size: 20px;
}

.editor-button-root {
  position: fixed;
  bottom: 100px;
  right: 5%;
}
.editor-button {
  float: right;
  width: 50px;
  height: 50px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
.editor-button-icon {
  font-size: 30px;
}

.post-item-summary {
  width: 100%;
  height: 100%;
  margin: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.search-history {
  margin-left: 10px;
  margin-bottom: 10px;
}
.search-tag{
  font-size:14px;
  margin:8px;
  padding-left:10px;
  padding-right:10px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 10px;
}
</style>