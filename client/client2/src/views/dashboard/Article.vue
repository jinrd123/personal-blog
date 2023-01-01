<template>
  <div>
    <n-tabs default-value="add" justify-content="start" type="line">
      <n-tab-pane name="add" tab="Oasis"> Wonderwall </n-tab-pane>
      <n-tab-pane name="the beatles" tab="添加文章">
        <n-form>
            <n-form-item label="标题">
                <n-input v-model:value="addArticle.title" placeholder="请输入标题"/>
            </n-form-item>
            <n-form-item label="内容">
                <rich-text-editor v-model="addArticle.content"></rich-text-editor>
            </n-form-item>
            {{addArticle.content}}
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { NTabs, NTabPane, NForm, NFormItem, NInput } from "naive-ui";
import RichTextEditor from "../../components/RichTextEditor.vue";
const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: "",
})
</script>

<style scoped>
</style>