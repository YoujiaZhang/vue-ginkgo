<template>
  <div
    class="drag-ball"
    ref="dragBall"
    @touchstart.stop.prevent="touchstart"
    @touchmove.stop.prevent="touchmove"
    @touchend.stop.prevent="touchend"
  >
    <div class="drag-content">
      <slot name="value"
        ><a-icon class="back-button-icon" type="swap-left"
      /></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "drag-ball",
  props: {
    value: {
      type: String,
      default: "悬浮球",
    },
  },
  data() {
    return {
      // zyj: 0,
      canDrag: false,
      // 偏移
      inset: {
        left: 0,
        top: 0,
      },
      // 移动
      move: {},
      // 位置
      position: {
        left: 0,
        top: 0,
      },
      // 初始位置
      positionOld: {},
      startTime: null,
      endTime: null,
    };
  },
  methods: {
    touchstart(e) {
      if (!this.canDrag) {
        this.startTime = e.timeStamp;
        this.positionOld = this.getPosition(this.dragBall);
        this.position = { ...this.positionOld };
        this.inset = {
          left: e.targetTouches[0].clientX - this.positionOld.left,
          top: e.targetTouches[0].clientY - this.positionOld.top,
        };
        this.canDrag = true;
      }
    },
    touchmove(e) {
      if (this.canDrag) {
        let left = e.targetTouches[0].clientX - this.inset.left;
        let top = e.targetTouches[0].clientY - this.inset.top;

        if (left < 0) {
          left = 0;
        } else if (left > window.innerWidth - this.dragBall.offsetWidth) {
          left = window.innerWidth - this.dragBall.offsetWidth;
        }
        if (top < 0) {
          top = 0;
        } else if (top > window.innerHeight - this.dragBall.offsetHeight) {
          top = window.innerHeight - this.dragBall.offsetHeight;
        }
        this.dragBall.style.left = left + "px";
        this.dragBall.style.top = top + "px";
        this.move = {
          x: left - this.positionOld.left,
          y: top - this.positionOld.top,
        };
        this.position = { left, top };


        this.dragBall.style.borderTopRightRadius =
          (0.8 - left / window.innerWidth) * 100 + "px";
        this.dragBall.style.borderBottomRightRadius =
          (0.8 - left / window.innerWidth) * 100 + "px";

        this.dragBall.style.borderTopLeftRadius =
          (left / window.innerWidth) * 100 + "px";
        this.dragBall.style.borderBottomLeftRadius =
          (left / window.innerWidth) * 100 + "px";

        // this.zyj = left/window.innerWidth;
        // this.zyj = this.zyj.toFixed(2);
      }
    },
    touchend(e) {
      if (this.canDrag) {
        this.endTime = e.timeStamp;
        if (
          this.endTime - this.startTime > 400 ||
          Math.abs(this.move.x) > 2 ||
          Math.abs(this.move.y) > 2
        ) {
          // 非单击事件
          if (
            this.position.left + this.dragBall.offsetWidth / 2 >
            window.innerWidth / 2
          ) {
            // 当靠近《右边》的屏幕时
            this.dragBall.style.left =
              window.innerWidth - this.dragBall.offsetWidth + "px";
            this.dragBall.style.borderTopRightRadius = "0px";
            this.dragBall.style.borderBottomRightRadius = "0px";
          } else {
            // 当靠近《左边》的屏幕时
            this.dragBall.style.left = 0 + "px";
            this.dragBall.style.borderTopLeftRadius = "0px";
            this.dragBall.style.borderBottomLeftRadius = "0px";
          }
        } else {
          this.$emit("click");
          // 点击触发的事件
        }

        this.inset = {};
        this.move = {};
        this.position = {};
        this.canDrag = false;
      }
    },

    // 获取dom的绝对位置
    getPosition(source) {
      let left = source.offsetLeft; //获取元素相对于其父元素的left值var left
      let top = source.offsetTop;
      let current = source.offsetParent; // 取得元素的offsetParent // 一直循环直到根元素
      while (current != null) {
        left += current.offsetLeft;
        top += current.offsetTop;
        current = current.offsetParent;
      }
      return {
        left: left,
        top: top,
      };
    },
  },
  computed: {
    dragBall() {
      return this.$refs.dragBall;
    },
  },
};
</script>
<style scoped>
.drag-ball {
  position: fixed;
  z-index: 1000;
  top: 75%;
  width: 50px;
  height: 35px;
  background: #8cc269;
  backdrop-filter: blur(1px);

  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drag-ball .drag-content {
  overflow-wrap: break-word;
  font-size: 14px;
  color: #fff;
  letter-spacing: 2px;
}
.back-button-icon {
  float: right;
  font-size: 30px;
}
</style>
