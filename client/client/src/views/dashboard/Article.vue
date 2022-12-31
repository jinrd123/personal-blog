<template>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px">
                <n-card :title="blog.title">
                    {{ blog.content }}

                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>

            <n-space>
                <div @click="toPage(pageNum)" v-for="pageNum in  pageInfo.pageCount">
                    <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">{{ pageNum }}</div>
                </div>
            </n-space>

        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">

            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>

        </n-tab-pane>
        <n-tab-pane name="update" tab="修改">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <!-- <rich-text-editor v-model="updateArticle.content"></rich-text-editor> -->
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import RichTextEditor from '../../components/RichTextEditor.vue'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()
/*
    相关方法
*/
//读取博客列表
const loadBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    let temp_rows = res.data.data.rows;
    for (let row of temp_rows) {
        row.content += "..."
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
}
/*
    导航栏分类相关
*/
const tabValue = ref("list")
/*
    分页相关的逻辑
*/
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0,
})
/*
    文章列表相关
*/
const blogListInfo = ref([])
onMounted(() => {
    loadBlogs()
})
/*
    修改文章相关逻辑
*/
const updateArticle = reactive({
    id: 0,
    categoryId: 0,
    title: "",
    content: "",
})
const toUpdate = async (blog) => {
    tabValue.value = "update"
    let res = await axios.get("/blog/detail?id=" + blog.id)
    updateArticle.id = blog.id
    // updateArticle.id = await axios.get(`category/getbyid?id=${blog.category_id}`);
    updateArticle.title = res.data.rows[0].title
    updateArticle.content = res.data.rows[0].content
    updateArticle.categoryId = res.data.rows[0].category_id
}
const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
        tabValue.value = "list"
    } else {
        message.error(res.data.msg)
    }
}
/*
    删除相关的逻辑
*/
const toDelete = async (blog) => {
    let res = await axios.delete("/blog/_token/delete?id="+blog.id)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }
}
/*
    添加文章相关逻辑
*/
const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: "",
    categoryName: "",
})
onMounted(() => {
    categoryInit();
})
const categoryInit = async () => {
    let defaultCategory = await axios.get("/category/list");
    addArticle.categoryName = defaultCategory.data.rows[0].name;
    addArticle.categoryId = defaultCategory.data.rows[0].id;
}
const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
}
/*
    获取添加文章时的选择分类列表
*/
const categortyOptions = ref([])
const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    categortyOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
}
onMounted(() => {
    loadCategorys()
})
/*
    分页器切换页码
*/
const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}
</script>

<style lang="scss" scoped>

</style>