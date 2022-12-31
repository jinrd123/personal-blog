<template>
  <div class="main-panel">
    <div class="menus">
      <div v-for="(menu, index) in menus" @click="toPage(index)" :class="[pageTag===index?'active':'']">
        {{ menu.name }}
      </div>
    </div>
    <div style="padding:20px;width:100%">
        <router-view></router-view>
    </div>
    <div class="title">菜鸡达达</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AdminStore } from "../../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute()

const adminStore = AdminStore();

let menus = [
  { name: "文章管理", href: "/dashboard/article" },
  { name: "分类管理", href: "/dashboard/category" },
  { name: "退出", href: "logout" },
];

let pageTag = ref(0); // 0, 1, 2对应三个menus
const toPage = (index: number) => {
    pageTag.value = index;
    if(menus[pageTag.value].href === "logout") {
        adminStore.token = "";
        router.push("/login");
    }else {
        router.push(menus[pageTag.value].href);
    }
}
</script>

<style lang="scss" scoped>
.main-panel {
  display: flex;
  color: #64676a;
  max-width: 1500px;
  margin: 0 auto;
}

.menus {
  padding: 20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 95vh;
  border-right: 1px solid #dadada;

  div {
    cursor: pointer;

    &:hover {
      color: #fd760e;
    }
  }
}

.title {
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 20px;
}

.active {
    color: black;
    font-weight: 700;
}
</style>