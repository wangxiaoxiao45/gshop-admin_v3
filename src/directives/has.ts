import pinia from "@/stores";
import { useUserInfoStore } from "@/stores/userInfo";

import type { App } from "vue";
/**
 * 按钮权限控制的自定义指令
 */
export default (app: App) => {
  const userInfoStore = useUserInfoStore(pinia);
  /**自定义按钮权限指令 */
  app.directive("has", {
    mounted(el, binding) {
      console.log(userInfoStore.authBtnList.includes(binding.value))
      // 判断是否有权限
      if (!userInfoStore.authBtnList.includes(binding.value)) {
        //移除不匹配的按钮
        el.parentNode.removeChild(el);
      }
    },
  });
};
