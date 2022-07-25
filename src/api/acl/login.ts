import type { loginResponseModel, userInfoResponseModel } from './model/loginModel';
import request from '@/utils/request';

enum Api {
  Login = '/admin/acl/index/login',
  Logout = '/admin/acl/index/logout',
  getUserInfo = '/admin/acl/index/info',
}

/**
 * 登陆
 * @param username 用户名
 * @param password 密码
 * @returns loginResponseModel
 */
export const loginApi = (username: string, password: string) => {
  return request.post<any, loginResponseModel>(Api.Login, {username, password})
}

/**
 * 退出登陆
 * @returns 
 */
export const logoutApi = () => {
  return request.post<any, void>(Api.Logout)
}

/**
 * 获取用户信息
 * @returns userInfoResponseModel
 */
export const getUserInfoApi = () => {
  return request.get<any, userInfoResponseModel>(Api.getUserInfo)
}