<template>
  <div class="container">
    <div class="nav">
      <div @click="homePage">首页</div>
      <div>
        <n-popselect
          v-model:value="selectedCategory"
          :options="categoryOptions"
          trigger="click"
        >
          <div>
            分类<span>{{ categoryName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="dashboard">后台</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NPopselect } from "naive-ui";
import { ref, onMounted, watch, computed } from "vue";
import { reqCategoryList } from "../api/index";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const categoryOptions = ref([]); // 存储n-popselect分类下拉列表的配置对象

const selectedCategory = ref(0); // 记录当前选中的分类的id

const categoryListInit = async () => {
  let result = await reqCategoryList();
  categoryOptions.value = result.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const categoryName = computed(() => {
  let selectOption = categoryOptions.value.find((option) => {
    return option.value === selectedCategory.value;
  });
  return selectOption ? selectOption.label : "";
});

onMounted(() => {
  categoryListInit();
});

const homePage = () => {
    router.push("/");
}
const dashboard = () => {
    router.push("/login");
}
</script>

<style scoped lang="scss">
.container {
  width: 1200px;
  margin: 0 auto;
}
.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;
  div {
    cursor: pointer;
    margin-right: 15px;
    &:hover {
      color: #f60;
    }
    span {
        font-size: 12px;
    }
  }
}
</style>