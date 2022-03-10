<template>
  <div
    class="weui-pull-refresh"
    ref="scrollBox"
    :style="style"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <div
      id="weui-pull-refreshing-box"
      class="weui-pull-refreshing-box"
      v-if="show"
    >
      <div v-if="moveState < 2">
        {{ "释放即可刷新" }}
      </div>
      <div class="loading" v-else>
        <a-spin class="loading-spin" tip="刷新中···">
          <a-icon
            slot="indicator"
            type="redo"
            style="font-size: 24px"
            spin
          />
        </a-spin>
      </div>
    </div>

    <div class="weui-pull-present-box">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "pull-refresh",
  data() {
    return {
      height: 0,
      startY: "", //保存touch时的Y坐标
      moveDistance: 0, //保存向下滑动的距离
      moveState: 0, //开始滑动到结束后状态的变化 0:下拉即可刷新 1:释放即可刷新 2:加载中
      duration: 0, //动画持续时间，0就是没有动画

      show: false,
    };
  },
  computed: {
    style() {
      return {
        transition: `${this.duration}ms`,
        transform: `translate3d(0,${this.moveDistance}px, 0)`,
      };
    },
  },
  methods: {
    touchStart(e) {
      this.duration = 0; // 关闭动画
      this.moveDistance = 0; // 滑动距离归0
      this.startY = e.targetTouches[0].clientY; // 获得开始Y坐标
    },
    touchMove(e) {
      //这里是整个下拉刷新的核心
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //上面的注释掉，是因为上面针对的容器是document，根据自己需要下拉的容器判断
      if (!scrollTop && scrollTop != 0) {
        return console.log("该页面没有pull-container容器：" + scrollTop);
      }
      //首先判断我们有没有滚动条，如果有，我们下拉刷新就不能启用。就是说页面不在最顶部，下拉是进行页面正常滚动的
      if (scrollTop > 0) return;

      let move = e.targetTouches[0].clientY - this.startY;
      //判断手指滑动的距离，只有为正数才代表用户下拉了。
      if (move > 0) {
        //阻止默认事件，在微信浏览器中尤为有用，至于为什么，你去试就知道了。
        e.preventDefault();
        //增加滑动阻力的感觉
        this.moveDistance = Math.pow(move, 0.8);
        if (this.moveDistance > this.height) {
          //如果滑动距离大于50 那我就告诉你，释放即可刷新
          this.show = true;
          if (this.moveState === 1) return;
          this.moveState = 1;
        } else {
          //否则 恢复原样
          if (this.moveState === 0) return;
          this.moveState = 0;
        }
      }
    },
    touchEnd() {
      // 只要手指拿开，我都需要加上结束时的动画，这里为300ms
      this.duration = 300;
      if (this.moveDistance > this.height) {
        //这里逻辑跟touchMove一样，但是需要真的加载数据了，那moveState变为2 所以加载动画在这出现
        this.moveState = 2;
        //因为还没加载完，我得让加载动画显示着，所以这里移动距离为50
        this.moveDistance = this.height;
        this.$emit("refresh", () => {
          //这里就是成功后的回调了，如果该函数被调用，那就以为着加载数据完成，所以状态要回到0，当然需要在父组件调用。
          this.moveState = 0;
          this.show = false;
        });
      } else {
        //否则 给我老老实实恢复原样
        this.moveDistance = 0;
      }
    },
  },
  watch: {
    //这里是给用户操作返回的核心
    moveState(state) {
      if (state === 0 && this.duration === 300) {
        this.moveDistance = 0;
      }
    },
  },
  mounted() {
    this.height = 30
  },
};
</script>
<style scoped>
.loading {
  position: absolute;
  top: 200px;
  width: 100%;
  text-align: center;
  font-size: 20px;
  z-index: 1000;
}
.loading-spin{
  background-color:#fff;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 100%;
}
.weui-pull-refresh {
  display: flex;
  flex-direction: column;
  margin-top: 0rem;
}
.weui-pull-refresh .weui-pull-refreshing-box {
  line-height: 1rem;
  /* height: 1rem; */
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  text-align: center;
}
.weui-pull-refresh .weui-pull-present-box {
  background-color: lighten(#fff, 10%);
}
</style>