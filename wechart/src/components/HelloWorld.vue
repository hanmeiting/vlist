<template>
  <div class="hello">
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created () {
    console.log(111);
    axios.get('http://localhost:3001/api/getMock',(res) => {
      console.log(res);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
