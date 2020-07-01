<template>
 <div class="context" @scroll="listScroll">
    <div class="list" :style="{height:height}" >
        <div class="translateBox" :style="{transform:transform}">
            <div class="titel">
                虚拟列表 : 高性能渲染十万条数据
            </div>
            <div v-for="(item, index) in list" :key="index" class="item">{{item}}</div>
        </div>
    </div>
 </div>
</template>

<script>
export default {
  name: "tere",
  props: {
    items: {
      type: Array
    }
  },
  data() {
    return {
      childHeight: 0,
      start: 0,
      scrollHeight:0,
      scrollTop : 0
    };
  },
  methods: {
      listScroll(ev) {
          let scrollTop = ev.target.scrollTop || window.event.target.scrollTop
          // 滚动高度 / 元素高度, 得到超出区域可容纳多少个item 得到滚动后的list开始索引
          this.start = Math.ceil(scrollTop / this.childHeight);
          // 更新当前滚动高度
          this.scrollTop = scrollTop
      }
  },
  computed: {

    // 列表总高度
    height() {
      // 依赖于 总数量 和 item高度
      return `${this.items.length * this.childHeight}px`
    },

    // 实际渲染数据
    list() {
      // 依赖于state更新 显示的list也会更新
      return this.items.slice(this.start, Math.min(this.end, this.items.length))
    },

    // 显示多少个dom
    itemSize(){
      // 依赖于scrollHeight 和 childHeight 屏幕高度或者item高度发生改变时 更新显示数量
      let size = Math.ceil(this.scrollHeight / this.childHeight)
      //>渲染作为数据驱动，初始化时 size 为 0 ，那么list 为 items.slice(0, 0) 不会渲染dom，mounted生命周期将获取不到 “.item” , 出现错误。
      return size ? size : 1
    },

    // slice(start, end)
    end() {
        // 依赖于start start更新end也会更新
        return this.start + this.itemSize
    },
    
    transform() {
        // 依赖于scrollTop 滚动高度更新 .translateBox 位置也会更新
        // .translateBox 是 list的父容器，确保它一直在视口
        return `translateY(${this.scrollTop}px)`
    }
  },
  mounted() {
    // 获取item高
    let { offsetHeight } = document.querySelector(".item")
    this.childHeight = offsetHeight
    // 获取屏幕高
    this.scrollHeight = window.innerHeight
  }
};
// 参考于: https://juejin.im/post/5db684ddf265da4d495c40e5
</script>

<style scoped>
.context{
    height: 100vh;
    overflow: auto;
    
    background-color: bisque;
    -webkit-overflow-scrolling: touch;
}
.translateBox{
    position: relative;
}
.titel{
    position:fixed;
    left: 10px;
    top:10px;
}
.item {
  width: 100vw;
  height: 6vh;
  line-height: 6vh;
}
.item:nth-child(2n) {
  background-color: rgba(210, 180, 140, 0.404);
}
</style>