<template>
  <div class="home" ref="container" v-if="show">
    <!-- <input type="text" v-model="value" @input="inputFn" /> -->
    <!-- <input type="text" v-model="value" @input="debounce(getVal,500)" /> -->
    <!-- <ul>
      <li v-for="(item) in list" :key="item.id">
        <p>姓名：{{item.name}}</p>
        <p>描述：{{item.text}}</p>
      </li>
    </ul>-->
    <VirtualBlock
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
    </VirtualBlock>
    <button @click="getHeight()">click</button>
  </div>
</template>

<script>
import request from "../utils/request";
import Cookie from "js-cookie";
export default {
  name: "home",
  data() {
    return {
      list: [],
      value: "",
      timmer: "",
      inputFn: null,
      dataAmt: "1000",
      isPageMode: true,
      isFixedHeight: true,
      show: false,
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
      console.log('servicetypesApi');
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
    // setTimeout(() => {
    //   console.log("setTimeout::", document.body.offsetHeight); // 10082
    // }, 1000);
    this.$nextTick(function () {
      console.log("nextTick::", document.body.offsetHeight); // 82
    });
  },
  async created() {
    console.log(2222);
    Cookie.set("name", "hanting");
    // const res = await this.servicetypesApi()
    // this.list = res.data;
    console.log(this.list);
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
  }
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
</style>