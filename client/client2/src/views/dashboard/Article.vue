<template>
  <div>
    <n-tabs default-value="list" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog, index) in articleList" :key="blog.id">
          <n-card :title="blog.title" style="margin-bottom: 15px">
            <div v-html="blog.content" class="content"></div>
            <template #footer>
              <n-space align="center">
                <div>发布时间：{{ fomatTime(blog.create_time) }}</div>
                <n-button>修改</n-button>
                <n-button>删除</n-button>
              </n-space>
            </template>
          </n-card>
        </div>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
          <n-form-item label="标题">
            <n-input
              v-model:value="addArticle.title"
              placeholder="请输入标题"
            />
          </n-form-item>
          <n-form-item label="标题">
            <n-select
              v-model:value="addArticle.categoryId"
              :options="selectOptions"
              placeholder="选择分类"
            />
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
import {
  NTabs,
  NTabPane,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NCard,
  NSpace,
} from "naive-ui";
import RichTextEditor from "../../components/RichTextEditor.vue";
import {
  reqCategoryList,
  reqAddArticle,
  reqBlogList,
} from "../../api/index.js";
import { injectKeyMessage } from "../../context/context.js";
const message = inject(injectKeyMessage);
const addArticle = reactive({
  categoryId: null,
  title: "",
  content: "",
});

let selectOptions = ref(null);
let articleList = ref(null);
onMounted(() => {
  selectOptionInit();
  articleListInit();
});
const selectOptionInit = async () => {
  let result = await reqCategoryList();
  selectOptions = result.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const articleListInit = async () => {
  let result = await reqBlogList();
  articleList.value = result.data.data.rows;
};

const add = async () => {
  let result = await reqAddArticle(addArticle);
  if (result.data.code === 200) {
    message.info(result.data.msg);
    addArticle.categoryId = null;
    addArticle.title = "";
    addArticle.content = "";
    /*
      此处应该转跳至文章列表页面（待开发）
    */
  } else {
    message.error(result.data.msg);
  }
};

const fomatTime = (timeStamp) => {
  let date = new Date(timeStamp);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
</script>

<style scoped lang="scss">
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>