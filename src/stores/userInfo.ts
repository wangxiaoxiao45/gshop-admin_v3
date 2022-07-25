import { defineStore } from 'pinia';
import { loginApi, logoutApi, getUserInfoApi } from '../api/acl/login';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import type { RouteRecordRaw } from 'vue-router';
import { allAsyncRoutes, anyRoute, staticRoutes } from '@/router/routes';
import router from '@/router';
import {cloneDeep} from 'lodash'

/**
 * 递归过滤异步路由表，返回符合用户菜单权限的路由表
 * @param asyncRoutes
 * @param routeNames
 */
function filterAsyncRoutes(allAsyncRoutes: RouteRecordRaw[], routeNames: string[]) {
  return allAsyncRoutes.filter(route => {
    // 如果route的name在routeNames中没有, 直接过滤掉
    if (routeNames.indexOf(route.name as string)===-1) {
      // console.log(route.name)
      return false
    }
    // 如果当前route还有子路由(也就是有children), 需要对子路由也进行权限过滤
    if (route.children && route.children.length>0) {
      // 递归调用, 对子路由进行过滤产生子路由的列表, 并替换掉原本的children
      route.children = filterAsyncRoutes(route.children, routeNames)
    }
    return true
  })
}

/**
 * 动态注册路由
 * @param routes 
 */
function addRoutes(routes: RouteRecordRaw[]) {
	routes.forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
  // console.log(router.getRoutes())
}

/**
 * 重置路由
 */
function resetRouter() {
  const routes = router.getRoutes()
  routes.forEach(r => {
    if (r.name) {
      router.removeRoute(r.name as string)
    }
  })
  staticRoutes.forEach(r => router.addRoute(r))
}

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
    name: '',
    avatar: '',
    authBtnList: [],
    roles: [],
    menuRoutes: [],
  }),

	actions: {
    /**
     * 登陆
     * @param username 
     * @param password 
     */
    async login (username: string, password: string) {
      const {token} = await loginApi(username, password)
      this.token = token
      setToken(token)
    },

    /**
     * 获取用户信息
     */
    async getInfo () {
      const info = await getUserInfoApi()
      this.name = info.name
      this.avatar = info.avatar
      this.authBtnList = info.buttons
      this.roles = info.roles
      console.log(router.getRoutes())
      this.setRoutes(info.routes)
    },

    /* 
    处理权限路由
    */
    setRoutes(routeNames: string[]) {
      // 过滤出权限路由
      const asyncRoutes = filterAsyncRoutes(cloneDeep(allAsyncRoutes), routeNames)
      // 动态注册权限路由列表和任意路由
      addRoutes([...asyncRoutes, anyRoute])
      // 保存用于显示导航菜单的路由列表
      this.menuRoutes = [...staticRoutes, ...asyncRoutes]
		},

    /**
     * 重置/退出登陆
     */
    async reset () {
      // 如果当前是登陆的, 请求退出登陆
      if (this.name) {
        await logoutApi()
      }
      // 删除local中保存的token
      removeToken()
      // 重置路由
      resetRouter()
      // 重置信息
      this.token = ''
      this.name = ''
      this.avatar = ''
      this.authBtnList = []
      this.roles = []
      this.menuRoutes = []
    },
	},
});
