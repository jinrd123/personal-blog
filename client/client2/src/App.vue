<template>
  <div>
    <div>123</div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { reqTest } from "./api/index.js";
import { onMounted } from "vue";
onMounted(async () => {
  let result = await reqTest();
  console.log(result);
})

</script>

<style scoped>
</style>
