<template>
  <div id="app" class="home" ref="container">
    <template>
      <DynamicScroller :items="list" :min-item-size="54" class="scroller">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
          item.message,
        ]"
            :data-index="index"
          >
            <div class="avatar">
              <img :src="item.avatar" :key="item.avatar" alt="avatar" class="image" />
            </div>
            <div class="text">{{ item.message }}</div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </template>
    <!-- <input type="text" v-model="value" @input="inputFn" /> -->
    <!-- <input type="text" v-model="value" @input="debounce(getVal,500)" /> -->
    <!-- <VirtualBlock
      :fixedBlockHeight="isFixedHeight ? 50 : undefined"
      v-if="true"
      :pageMode="isPageMode"
      :height="500"
      :data="list"
      ref="vb"
    >
      <template slot-scope="{data}">
        <div :style="{height: '100%'}">{{data.name}}</div>
      </template>
    </VirtualBlock>-->
    <!-- <button @click="getHeight()">click</button> -->
  </div>
</template>

<script>
import request from "./utils/request";
import Cookie from "js-cookie";
export default {
  name: "home",
  data() {
    return {
      list: [],
      value: "",
      timmer: "",
      inputFn: null,
      computedTotalHeight: 50,
      // isPageMode: true,
      // isFixedHeight: true,
      // show: false,
    };
  },
  methods: {
    getHeight() {
      this.$nextTick(function () {
        console.log(document);
        console.log("nextTick::", document.body.offsetHeight); // 82
      });
    },

    getVal(e) {
      console.log(e.target.value);
    },
    servicetypesApi() {
      let config = {
        url: "api/getMock",
        method: "GET",
      };
      return request(config);
    },
    // 防抖的核心代码
    debounce(fn, wait) {
      let timer = null;
      return function () {
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, wait);
      };
    },
    getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight =
          document.body.clientHeight < document.documentElement.clientHeight
            ? document.body.clientHeight
            : document.documentElement.clientHeight;
      } else {
        var clientHeight =
          document.body.clientHeight > document.documentElement.clientHeight
            ? document.body.clientHeight
            : document.documentElement.clientHeight;
      }
      return clientHeight;
    },
  },
  mounted() {
    this.show = true;
    this.$nextTick(function () {
      console.log("nextTick::", document.body.offsetHeight); // 82
    });
  },
  async created() {
    Cookie.set("name", "hanting");
    // const res = await this.servicetypesApi();
    // this.list = res.data;
    let time = null;
    const _self = this;
    window.onscroll = function () {
      clearTimeout(time);
      time = setTimeout(() => {
        console.log("getScrollTop::" + _self.getScrollTop());
        console.log("可视范围：" + _self.getClientHeight());
      }, 500);
    };
    this.inputFn = this.debounce(this.getVal, 500);
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  display: flex;
  justify-items: center;
  border-bottom: 1px solid #ccc;
  flex-direction: column;
  p {
    text-align: left;
  }
}
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>