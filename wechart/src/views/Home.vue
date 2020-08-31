<template>
  <div class="recycle-scroller-demo">
    <div class="content">
      <div class="wrapper">
        <!-- :item-size="itemHeight" -->
          <!-- :buffer="buffer" -->
          <!-- :key="pageModeFullPage" -->
        <RecycleScroller
          ref="scroller"
          class="scroller"
          :items="list"
          :page-mode="pageMode"
          key-field="id"
          size-field="height"
          @visible="onVisible"
          @hidden="onHidden"
          @update="onUpdate"
          :emitUpdate="emitUpdate"
        >
          <template v-slot="props">
            <Person v-if="props.item.type === 'person'" :item="props.item" :index="props.index" />
          </template>
        </RecycleScroller>
      </div>
    </div>
  </div>
</template>

<script>
import { getData, addItem } from "../utils/data";

import Person from "./Person.vue";
import request from "../utils/request";
export default {
  components: {
    Person,
  },

  data: () => ({
    items: [],
    list: [],
    count: 10000,
    renderScroller: true,
    showScroller: true,
    scopedSlots: false,
    buffer: 200,
    poolSize: 2000,
    enableLetters: true,
    pageMode: false,
    pageModeFullPage: true,
    updateCount: 0,
    emitUpdate:false
  }),

  computed: {
    countInput: {
      get() {
        return this.count;
      },
      set(val) {
        if (val > 500000) {
          val = 500000;
        } else if (val < 0) {
          val = 0;
        }
        this.count = val;
      },
    },

    itemHeight() {
      return this.enableLetters ? null : 50;
    },

    // list() {
    //   return this.items.map((item) =>
    //     Object.assign(
    //       {},
    //       {
    //         random: Math.random(),
    //       },
    //       item
    //     )
    //   );
    // },
  },

  // watch: {
  //   count() {
  //     this.generateItems();
  //   },
  //   enableLetters() {
  //     this.generateItems();
  //   },
  // },

  mounted() {
    // this.$nextTick(this.generateItems);
    window.scroller = this.$refs.scroller;
    
  },
  async created() {
    // this.generateItems();
    const res = await this.servicetypesApi();
    this.list = res.data || [];
    this.emitUpdate = this.list.length > 0 ? true :false
    console.log(this.emitUpdate);
  },
  methods: {
    servicetypesApi() {
      let config = {
        url: "api/getMock",
        method: "GET",
      };
      return request(config);
    },
    async generateItems() {
      // console.log("Generating " + this.count + " items...");
      let time = Date.now();
      const res = await this.servicetypesApi();
      const items = res.data;
      console.log(
        "Generated " + items.length + " in " + (Date.now() - time) + "ms"
      );
      this._dirty = true;
      // this.items = items;
      this.list = items;
    },

    addItem() {
      addItem(this.items);
    },

    async onUpdate(startIndex, endIndex) {
      this.updateCount++;
      console.log("=========================================");
      // console.log(this.updateCount);
      console.log(startIndex, endIndex);
      // console.log(this.list.length);
      const length = this.list.length
      console.log(length);
      if(length-endIndex<10){
        const res = await this.servicetypesApi();
        this.list.push(...res.data)
      }
    },

    onVisible() {
      console.log("visible");
    },

    onHidden() {
      console.log("hidden");
    },
  },
};
</script>

<style scoped>
.recycle-scroller-demo:not(.page-mode) {
  height: 100%;
}

.recycle-scroller-demo.page-mode:not(.full-page) {
  height: 100%;
}

.recycle-scroller-demo.page-mode {
  flex: auto 0 0;
}

.recycle-scroller-demo.page-mode .toolbar {
  border-bottom: solid 1px #e0edfa;
}

.content {
  flex: 100% 1 1;
  border: solid 1px #42b983;
  position: relative;
}

.recycle-scroller-demo.page-mode:not(.full-page) .content {
  overflow: auto;
}

.recycle-scroller-demo:not(.page-mode) .wrapper {
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.scroller {
  width: 100%;
  height: 100%;
}

.letter {
  text-transform: uppercase;
  color: grey;
  font-weight: bold;
}

.letter .td {
  padding: 12px;
}

.letter.big {
  font-weight: normal;
  height: 200px;
}

.letter.big .value {
  font-size: 120px;
}
</style>
