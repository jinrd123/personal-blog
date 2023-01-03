<template>
  <div>
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { inject, watch } from "vue";
import {
  shallowRef,
  ref,
  onBeforeUnmount,
  defineProps,
  defineEmits,
} from "vue";
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = {
    excludeKeys: ["uploadVideo"], // 屏蔽视频上传功能
};

const server_url = inject("server_url");
interface editorConfigInterface {
  placeholder: string;
  MENU_CONF: Object;
}
const editorConfig: editorConfigInterface = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
};
editorConfig.MENU_CONF["uploadImage"] = {
  base64LimitSize: 10 * 1024, // 小体积图片转base64而不进行上传
  server: server_url + "/upload/rich_editor_upload", // 配置上传的服务端地址
};

editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src:string) => {
        if(src.indexOf("http") !== 0) {
            return `${server_url}${src}`;
        }
    }
}

const mode = ref("default");
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const valueHtml = ref(props.modelValue);
// Article组件中修改传来的文章content时(也就是添加文章之后置空内容)，同步更新这里的valueHtml
watch(() => props.modelValue, (newValue) => {
  valueHtml.value = newValue;
})
// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

const emit = defineEmits(["update:modelValue"]);

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  emit("update:modelValue", valueHtml.value);
};
</script>

<style scoped>
</style>