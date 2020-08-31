<template>
  <div class="recycle-scroller-demo">
    <VirtualBlock
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
  </div>
</template>

<script>
import VirtualBlock from "../components/VirtualBlock";
import request from "../utils/request";
export default {
  components: {
    VirtualBlock,
  },

  data: () => ({
    list: [],
    isPageMode: false,
    isFixedHeight: true,
    show: false,
  }),
  async created() {
    // this.generateItems();
    const res = await this.servicetypesApi();
    this.list = res.data || [];
  },
  methods: {
    servicetypesApi() {
      let config = {
        url: "api/getMock",
        method: "GET",
      };
      return request(config);
    },
  },
};
</script>
