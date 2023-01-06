<template>
  <div class="container">
    <n-h1>{{ blog.title }}</n-h1>
    <div>
      <div v-html="blog.content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { reqBlogDetail } from "../api/index.js";
import { NH1 } from "naive-ui";
const router = useRouter();
const route = useRoute();
const blog = ref({});
onMounted(() => {
  loadBlog();
});
const loadBlog = async () => {
  let result = await reqBlogDetail(route.params.id);
  blog.value = result.data.rows[0];
};
</script>

<style lang="scss">
// 因为p和img都是富文本编辑器生成的，所以这里只能消除scoped属性才能选中p和img标签
.container {
  padding: 20px;
  margin: 15px;
  width: 1200px;
  margin: 0 auto;
  p {
    > img {
      max-height: 400px;
      max-width: 100%;
    }
  }
}
</style>
