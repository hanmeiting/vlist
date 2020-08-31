<template>
  <div v-on="pageMode ? {} : {scroll: handleScroll}" :style="containerStyle" ref="vb">
    <div :style="{height: `${offsetTop}px`}"></div>
    <div
      v-for="item in renderList"
      :style="{height: `${fixedBlockHeight ? fixedBlockHeight : item.height}px`}"
      :key="`${item.id}`"
    >
      <slot :data="item"></slot>
    </div>
    <div :style="{height: `${offsetBot}px`}"></div>
  </div>
</template>

<script>
export default {
  props: {
    // data is required
    // height is required if pageMode is set to false
    // when fixedBlockHeight is specified, the height key in data will be ignored
    data: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
    },
    fixedBlockHeight: {
      type: Number,
    },
    pageMode: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      viewportBegin: 0,
      viewportEnd: this.height,
      offsetTop: 20,
      offsetBot: 0,
      renderList: [],
      transformedData: [],
    };
  },
  watch: {
    data: {
      handler: function (newVal, oldVal) {
        this.computeTransformedData(newVal);
        // code blow used to update view when data changed
        if (oldVal) {
          this.$nextTick(() => {
            // reset the scrollTop for container
            // update view by handleScroll()
            this.$refs.vb.scrollTop = 0;
            this.handleScroll();
          });
        }
      },
      immediate: true, // when not in page mode, initailize data here   不在页面模式时，在此处初始化数据
    },
    pageMode(newVal) {
      if (newVal) {
        window.addEventListener("scroll", this.handleScroll);
      } else {
        window.removeEventListener("scroll", this.handleScroll);
      }
      // recompute transformed data when pageMode changed
      this.computeTransformedData(this.data);
      this.$nextTick(() => {
        // reset the scrollTop for container
        // update view by handleScroll()
        this.$refs.vb.scrollTop = 0;
        this.handleScroll();
      });
    },
    fixedBlockHeight() {
      // update view when fixedBlockHeight changed
      this.handleScroll();
    },
  },
  created() {
    if (this.pageMode) {
      // add scroll onto window
      window.addEventListener("scroll", this.handleScroll);
    }
  },
  mounted() {
    if (this.pageMode) {
      // in page mode, initialize transformed data here
      this.computeTransformedData(this.data);
    }
    // initialize view by calling updateVb
    this.updateVb(0);
  },
  destroyed() {
    if (this.pageMode) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    computeTransformedData(oriArr) {
      // compute accumulative height value for each block 计算每个区块的累计高度值
      // note the function related to the variable 'pageMode' 注意与变量“pageMode”相关的函数
      // and when fixedRowHeight is specified, transformedData is not needed 如果指定了fixedRowHeight，则不需要transformedData
      if (
        !this.fixedRowHeight &&
        ((this.pageMode && this.$refs.vb) || !this.pageMode)
      ) {
        let curHeight = this.pageMode ? this.$refs.vb.offsetTop : 0;
        let rt = [curHeight];
        oriArr.forEach((item) => {
          curHeight += item.height;
          rt.push(curHeight);
        });
        this.transformedData = rt;  // 将列表的高度依次累加并且添加到数组 [0,50,100,150,200,...]
      }
    },
    handleScroll() {
      // scrollTop is relative to the varible pageMode
      const scrollTop = this.pageMode
        ? window.pageYOffset
        : this.$refs.vb.scrollTop;
      // use requestAnimationFrame to ensure smooth scrolling visual effects
      window.requestAnimationFrame(() => {
        this.updateVb(scrollTop);
      })
    },
    binarySearchLowerBound(s, arr) {
      debugger
      // used to search the lower bound in-viewport index for data array
      // when height is not fixed
      let lo = 0;
      let hi = arr.length - 1;
      console.log(arr.length);
      console.log(arr);
      console.log(hi);
      let mid;
      while (lo <= hi) {
        // integer division
        mid = ~~((hi + lo) / 2);
        if (arr[mid] > s) {
          if (mid === 0) {
            // start position less than the smallest element in arr
            return 0;
          } else {
            hi = mid - 1;
          }
        } else if (arr[mid] < s) {
          if (mid + 1 < arr.length) {
            if (arr[mid + 1] > s) {
              return mid;
            } else {
              // normal flow
              lo = mid + 1;
            }
          } else {
            // not a valid start position
            // start position > total height
            return -1;
          }
        } else {
          // only return the matched lower bound index
          // may be modified later for smooth
          return mid;
        }
      }
    },
    binarySearchUpperBound(e, arr) {
      // used to search the upper bound in-viewport index for data array  用于在视口索引中搜索数据数组的上限
      // when height is not fixed  高度不固定时
      let lo = 0;
      let hi = arr.length - 1;
      let mid;
      while (lo <= hi) {
        mid = ~~((hi + lo) / 2);
        if (arr[mid] > e) {
          if (mid > 0) {
            if (arr[mid - 1] < e) {
              return mid;
            } else {
              // normal flow
              hi = mid - 1;
            }
          } else {
            // not a valid end position
            // end position < view port start position
            return -1;
          }
        } else if (arr[mid] < e) {
          if (mid === arr.length - 1) {
            // end position greater than the biggest element in arr
            return arr.length - 1;
          } else {
            lo = mid + 1;
          }
        } else {
          // lower bound should return previous block
          // the slice func handles the index offset issue
          return mid;
        }
      }
    },
    fixedBlockHeightLowerBound(s, fixedBlockHeight) {
      // used to compute the lower bound in-viewport index for data array
      // when in fixed height mode

      // ~~的作用是去掉小数部分，因为位运算的操作值要求是整数，其结果也是整数，所以经过位运算的都会自动变成整数
      const sAdjusted = this.pageMode ? s - this.$refs.vb.offsetTop : s;
      const computedStartIndex = ~~(sAdjusted / fixedBlockHeight);
      return computedStartIndex >= 0 ? computedStartIndex : 0;
    },
    fixedBlockHeightUpperBound(e, fixedBlockHeight) {
      // used to compute the upper bound in-viewport index for data array
      // when in fixed height mode
      const eAdjusted = this.pageMode ? e - this.$refs.vb.offsetTop : e;
      const compuedEndIndex = Math.ceil(eAdjusted / fixedBlockHeight);
      return compuedEndIndex <= this.data.length
        ? compuedEndIndex
        : this.data.length;
    },
    findBlocksInViewport(s, e, heightArr, blockArr) {
      // 设置offsetTop，offsetBot，并且返回第一页渲染数据列表
      if (s < e) {
        const lo = this.fixedBlockHeight
          ? this.fixedBlockHeightLowerBound(s, this.fixedBlockHeight)
          : this.binarySearchLowerBound(s, heightArr);
        const hi = this.fixedBlockHeight
          ? this.fixedBlockHeightUpperBound(e, this.fixedBlockHeight)
          : this.binarySearchUpperBound(e, heightArr);

        var vbOffset = this.pageMode ? this.$refs.vb.offsetTop : 0;
        // set top spacer
        if (this.fixedBlockHeight) {
          this.offsetTop = lo >= 0 ? lo * this.fixedBlockHeight : 0;
        } else {
          this.offsetTop = lo >= 0 ? heightArr[lo] - vbOffset : 0;
        }
        // set bot spacer
        if (this.fixedBlockHeight) {
          this.offsetBot =
            hi >= 0 ? (blockArr.length - hi) * this.fixedBlockHeight : 0;
        } else {
          this.offsetBot =
            hi >= 0 ? heightArr[heightArr.length - 1] - heightArr[hi] : 0;
        }
        // return the sliced the data array
        return blockArr.slice(lo, hi);
      } else {
        this.offsetTop = 0;
        this.offsetBot = 0;
        return [];
      }
    },
    updateVb(scrollTop) {
      // compute the viewport start position and end position based on the scrollTop value  根据scrollTop值计算视口的开始位置和结束位置
      const viewportHeight = this.pageMode ? window.innerHeight : this.height; // 初始化 500
      this.viewportBegin = scrollTop; // 初始化：0
      this.viewportEnd = scrollTop + viewportHeight; // viewportEnd 初始化 500 + 0 = 500
      this.renderList = this.findBlocksInViewport(
        this.viewportBegin,
        this.viewportEnd,
        this.transformedData,
        this.data
      );
    },
  },
  computed: {
    containerStyle() {
      return {
        ...(!this.pageMode && { height: `${this.height}px` }),
        ...(!this.pageMode && { "overflow-y": "scroll" }),
      };
    },
  },
};
</script>