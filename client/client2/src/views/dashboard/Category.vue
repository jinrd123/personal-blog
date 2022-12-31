<template>
  <div>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>分类编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in categoryList" :key="item.id">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <n-space>
                <n-button>修改</n-button>
                <n-button>删除</n-button>
              </n-space>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { reqCategoryList } from "../../api/index.js";
import { NTable, NButton, NSpace } from "naive-ui";
const categoryList = ref([]);
onMounted(() => {
  categoryListInit();
});
const categoryListInit = async () => {
  let result = await reqCategoryList();
  categoryList.value = result.data.rows;
};
</script>

<style lang="scss" scoped>
</style>