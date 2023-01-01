import { InjectionKey } from "vue";
import { MessageApi, DialogApi } from "naive-ui"
export const injectKeyMessage: InjectionKey<MessageApi> = Symbol();
export const injectKeyDialog: InjectionKey<DialogApi> = Symbol();