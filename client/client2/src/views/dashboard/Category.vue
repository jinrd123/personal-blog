<template>
  <div>
    <n-button @click="addCategoryTrigger">添加分类</n-button>
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

    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="Dialog"
    >
      <template #header>
        <div>添加分类</div>
      </template>
      <div>
        <n-input v-model:value="addCategory.name"></n-input>
      </div>
      <template #action>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { reqCategoryList, reqAddCategory } from "../../api/index.js";
import { NTable, NButton, NSpace, NModal, NInput } from "naive-ui";
const categoryList = ref([]);
onMounted(() => {
  categoryListInit();
});
const categoryListInit = async () => {
  let result = await reqCategoryList();
  categoryList.value = result.data.rows;
};

const showModal = ref(false);
const addCategoryTrigger = () => {
  showModal.value = true;
}

const addCategory = reactive({
  name:"",
})

const add = async () => {
  let result = await reqAddCategory(addCategory);
  categoryListInit();
}
</script>

<style lang="scss" scoped>
</style>