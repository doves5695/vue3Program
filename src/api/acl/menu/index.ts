import request from '@/utils/request'
// 数据类型
import type { PermissionResponseData, MenuParams } from './type'
// 枚举地址
enum API {
  // 全部的菜单
  ALLPERMISSTION_URL = '/admin/acl/permission',
  // 添加新的
  ADDMENU_URL = '/admin/acl/permission/save',
  // 更新一个
  UPDATEMENU_URl = '/admin/acl/permission/update',
  // 删除功能的请求地址
  REMOVEMENU_URL = '/admin/acl/permission/remove/',
}
// 请求接口
export const reqAllPermisstion = () =>
  request.get<any, PermissionResponseData>(API.ALLPERMISSTION_URL)

// 更新或新增
export const reqAddOrUpdatePermisstion = (data: MenuParams) => {
  if (data.id) {
    // 如果有id说明是更新
    return request.put<any, any>(API.UPDATEMENU_URl, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

// 删除请求的方式
export const reqRemoveMenu = (id: number) =>
  request.delete<any, any>(API.REMOVEMENU_URL + id)
