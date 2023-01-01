<template>
  <div>
    <div style="margin-bottom:20px;">
      <n-button @click="addCategoryTrigger">添加分类</n-button>
    </div>
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
                <n-button @click="updataCategory(item)">修改</n-button>
                <n-button @click="deleteCategory(item)">删除</n-button>
              </n-space>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>

    <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
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

    <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分类</div>
      </template>
      <div>
        <n-input v-model:value="updateCategoryInfo.name" placeholder="请输入新名称"></n-input>
      </div>
      <template #action>
        <div>
          <n-button @click="update">提交</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject } from "vue";
import {
  reqCategoryList,
  reqAddCategory,
  reqDeleteCategory,
  reqUpdateCategory
} from "../../api/index.js";
import { NTable, NButton, NSpace, NModal, NInput } from "naive-ui";
import { injectKeyMessage, injectKeyDialog } from "../../context/context";
const message = inject(injectKeyMessage);
const dialog = inject(injectKeyDialog);
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
};

const addCategory = reactive({
  name: "",
});

const add = async () => {
  let result = await reqAddCategory(addCategory);
  if (result.data.code === 200) {
    categoryListInit();
    message.info("添加成功");
  } else {
    message.error("添加失败，请检查是否登录~");
  }
  showModal.value = false;
};

const deleteCategory = async (category: { id: number; name: string }) => {
  dialog.warning({
    title: "警告",
    content: "确定删除么？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      let result = await reqDeleteCategory(category.id);
      if (result.data.code === 200) {
        categoryListInit();
        message.info("删除成功");
      } else {
        message.error("删除失败，请检查是否登录~");
      }
    },
    onNegativeClick: () => {},
  });
};

const showUpdateModal = ref(false);
const updateCategoryInfo = reactive({
  id:0,
  name: "",
});
const updataCategory = async (category: {id: number, name: string}) => {
  updateCategoryInfo.id = category.id;
  updateCategoryInfo.name = category.name;
  showUpdateModal.value = true;
}
const update = async () => {
  let result = await reqUpdateCategory(updateCategoryInfo);
  if(result.data.code === 200) {
    message.info("修改成功~");
    categoryListInit();
  }else {
    message.error(result.data.msg);
  }
  showUpdateModal.value = false;
}
</script>

<style lang="scss" scoped>
</style>