// 角色管理模块接口
import request from '@/utils/request'
// 引入数据类型
import type { RoleResponseData, RoleData, MenuResponseData } from './type'
// 枚举接口
enum API {
  // 获取全部职位
  ALLROLE_URL = '/admin/acl/role/',
  // 新增岗位的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有的职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 全部职位权限的请求地址
  ALLPERMISSTION = '/admin/acl/permission/toAssign/',
  // 给对应的职位分配权限
  SETPERMISSTION_URL = '/admin/acl/permission/doAssign/?',
  // 删除的请求地址
  REMOVEROLE_URL = '/admin/acl/permission/remove/',
}
// 获取全部职位方法
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

// 对添加和更新职位的封装请求
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 获取树形控件权限的请求
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSTION + roleId)

// 给对应职位分配权限的请求
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )
// 删除某一职位
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)
