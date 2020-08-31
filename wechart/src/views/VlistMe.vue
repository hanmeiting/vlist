<template>
  <div class='parent' ref='block'>
    <div class="block" v-for="item in 100" :key='item'>
      fff
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: []
      }
    },
    methods: {
      handleScroll() {
        console.log(this.$refs.block.scrollTop);
      }
    },
    mounted () {
      const offsetTop = this.$refs.block.offsetTop; // 元素距离顶部的距离
      this.$refs.block.addEventListener("scroll", this.handleScroll);
    }
  }
</script>

<style scoped>
.block{
  height: 50px;
  background: #f00
}
.parent{
  height: 500px;
  overflow-y:scroll;
}
</style>