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
    <n-divider />

    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      />
      <n-button type="primary" ghost @click="search">搜索</n-button>
    </n-space>

    <div v-for="(blog, index) in articleList" :key="blog.id" style="cursor:pointer">
      <n-card :title="blog.title" style="margin-bottom: 15px" @click="toDetail(blog)">
        <div v-html="blog.content" class="content"></div>
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ fomatTime(blog.create_time) }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      v-model:page="pageInfo.page"
      :page-count="pageCount"
      @update:page="toPage"
    />
    <n-divider />
    <div class="footer">
      <div>靳荣达的垃圾堆</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NPopselect,
  NDivider,
  NCard,
  NSpace,
  NPagination,
  NButton,
  NInput,
} from "naive-ui";
import { ref, onMounted, watch, computed, reactive } from "vue";
import { reqCategoryList, reqBlogList } from "../api/index";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const categoryOptions = ref([]); // 存储n-popselect分类下拉列表的配置对象

const selectedCategory = ref(0); // 记录当前选中的分类的id

/*
  从Article组件中搬来的：获取文章列表相关逻辑(下面相邻代码皆为与Article中的逻辑重复部分)
*/
let articleList = ref(null);
const pageInfo = reactive({
  // 文章列表相关的参数
  page: 1, // （分页）页码——>发请求使用
  pageSize: 3, // （分页）单页的大小——>发请求使用
  count: 0, // 数据库中文章总数——>后台返回数据
  keyword: "",
});
// pageCount计算出来分页器一共有多少页,遍历这个数字形成html中的分页器
const pageCount = computed(() => {
  return Math.ceil(parseInt(pageInfo.count) / parseInt(pageInfo.pageSize));
});
const articleListInit = async () => {
  let result = await reqBlogList(pageInfo);
  articleList.value = result.data.data.rows;
  pageInfo.count = result.data.data.count;
};
const fomatTime = (timeStamp) => {
  let date = new Date(timeStamp);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};
// 分页相关切换
const toPage = () => {
  articleListInit();
};

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
  articleListInit();
});

const homePage = () => {
  router.push("/");
};
const dashboard = () => {
  router.push("/login");
};

// 搜索相关的回调
const search = async () => {
  let result = await reqBlogList(pageInfo);
  articleList.value = result.data.data.rows;
  pageInfo.count = result.data.data.count;
};

// 转跳至文章详情页
const toDetail = (blog) => {
  // router.push({path: "/detail", query: {
  //   id: blog.id,
  // }});
  window.open(`/detail/${blog.id}`);
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
.footer {
  text-align: center;
  color: #64676a;
  line-height: 25px;
}
.search.n-space {
  margin-bottom: 10px;
}
</style>