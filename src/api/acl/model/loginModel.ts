/* 
登陆返回的数据
*/
export interface loginResponseModel {
  token: string
}

/* 
获取用户信息返回的数据
*/
export interface userInfoResponseModel {
  name: string
  avatar: string
  
  buttons: string[]
  roles: string[]
  routes: string[]
}