<template>
  <div>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog, index) in articleList" :key="blog.id">
          <n-card :title="blog.title" style="margin-bottom: 15px">
            <div v-html="blog.content" class="content"></div>
            <template #footer>
              <n-space align="center">
                <div>发布时间：{{ fomatTime(blog.create_time) }}</div>
                <n-button @click="toUpdate(blog)">修改</n-button>
                <n-button>删除</n-button>
              </n-space>
            </template>
          </n-card>
        </div>
        <n-space>
          <span
            v-for="(page, index) in pageCount"
            :key="index"
            @click="toPage(page)"
            :style="[
              'color:' + (page == pageInfo.page ? 'red' : ''),
              'cursor:pointer',
            ]"
            >{{ page }}</span
          >
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
          <n-form-item label="标题">
            <n-input
              v-model:value="addArticle.title"
              placeholder="请输入标题"
            />
          </n-form-item>
          <n-form-item label="分类">
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
      <n-tab-pane name="update" tab="修改文章">
        <n-form>
          <n-form-item label="标题">
            <n-input
              v-model:value="updateArticle.title"
              placeholder="请输入标题"
            />
          </n-form-item>
          <n-form-item label="分类">
            <n-select
              v-model:value="updateArticle.categoryId"
              :options="selectOptions"
              placeholder="选择分类"
            />
          </n-form-item>
          <n-form-item label="内容">
            <rich-text-editor
              v-model="updateArticle.content"
            ></rich-text-editor>
          </n-form-item>
          <n-form-item>
            <n-button @click="update">提交</n-button>
          </n-form-item>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, inject, computed } from "vue";
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
  reqBlogDetail,
  reqUpdateArticle
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

const pageInfo = reactive({
  // 文章列表相关的参数
  page: 1, // （分页）页码——>发请求使用
  pageSize: 3, // （分页）单页的大小——>发请求使用
  count: 0, // 数据库中文章总数——>后台返回数据
});
// pageCount计算出来分页器一共有多少页,遍历这个数字形成html中的分页器
const pageCount = computed(() => {
  return Math.ceil(parseInt(pageInfo.count) / parseInt(pageInfo.pageSize));
});

//点击分页器的转跳函数
const toPage = (page) => {
  pageInfo.page = page; // 用户视觉上修改选中页码为高亮
  articleListInit(); // 数据展示上获取当前页码的数据
};

const articleListInit = async () => {
  let result = await reqBlogList(pageInfo);
  articleList.value = result.data.data.rows;
  pageInfo.count = result.data.data.count;
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
};

// 修改文章相关的数据对象
const updateArticle = reactive({
  id: 0,
  categoryId: null,
  title: "",
  content: "",
});

const tabValue = ref("list"); // n-tabs展示部分对应的标识变量
const toUpdate = async (blog) => {
  updateArticle.id = blog.id;
  updateArticle.categoryId = blog.category_id;
  updateArticle.title = blog.title;
  let result = await reqBlogDetail(blog.id);
  let completeContent = result.data.rows[0].content;
  updateArticle.content = completeContent;
  tabValue.value = "update";
};

const update = async () => {
  let result = await reqUpdateArticle(updateArticle);
  if(result.data.code === 200) {
    articleListInit();
    message.info("修改成功~");
    tabValue.value = "list";
  }else {
    message.error(result.data.msg)
  }
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