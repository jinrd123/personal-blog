<template>
  <div>
    <n-tabs default-value="add" justify-content="start" type="line">
      <n-tab-pane name="add" tab="Oasis"> Wonderwall </n-tab-pane>
      <n-tab-pane name="the beatles" tab="添加文章">
        <n-form>
          <n-form-item label="标题">
            <n-input
              v-model:value="addArticle.title"
              placeholder="请输入标题"
            />
          </n-form-item>
          <n-form-item label="标题">
            <n-select v-model:value="addArticle.categoryId" :options="selectOptions" placeholder="选择分类"/>
          </n-form-item>
          <n-form-item label="内容">
            <rich-text-editor v-model="addArticle.content"></rich-text-editor>
          </n-form-item>
          <n-form-item>
            <n-button @click="add">提交</n-button>
          </n-form-item>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, inject } from "vue";
import { NTabs, NTabPane, NForm, NFormItem, NInput, NSelect, NButton } from "naive-ui";
import RichTextEditor from "../../components/RichTextEditor.vue";
import { reqCategoryList, reqAddArticle } from "../../api/index.js";
import { injectKeyMessage } from "../../context/context.js";
const message = inject(injectKeyMessage);
const addArticle = reactive({
  categoryId: null,
  title: "",
  content: "",
});

let selectOptions = ref(null);
onMounted(() => {
  selectOptionInit();
})
const selectOptionInit = async () => {
  let result = await reqCategoryList();
  selectOptions = result.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
}

const add = async () => {
  let result = await reqAddArticle(addArticle);
  if(result.data.code === 200) {
    message.info(result.data.msg);
  }else {
    message.error(result.data.msg);
  }
}

</script>

<style scoped>
</style>