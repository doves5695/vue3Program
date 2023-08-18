// 用户管理模块的接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'
// 枚举接口地址
enum API {
  // 获取全部已有的用户账号信息
  ALLUSER_URL = 'admin/acl/user/',
  // 添加一个新的用户账号
  ADDUSER_URL = 'admin/acl/user/save',
  // 更新一个已有的用户账号
  UPDATEUSER_URL = 'admin/acl/user/update',
  // 获取全部职位, 以及当前账号拥有的职位的接口
  ALLROLEURL = 'admin/acl/user/toAssign/',
  // 给已有的用户分配角色接口
  SETROLE_URL = 'admin/acl/user/doAssignRole',
}
// 获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)

// 添加用户或者更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  // 携带参数有ID的为更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取全部职位以及包含当前用户的职位
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

// 分配职位
export const reqSetUserRole = (data: SetRoleData) => request.post<any,any>(API.SETROLE_URL, data);
