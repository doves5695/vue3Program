// 角色管理模块接口
import request from '@/utils/request'
// 引入数据类型
import type { RoleResponseData, RoleData } from './type'
// 枚举接口
enum API {
  // 获取全部职位
  ALLROLE_URL = '/admin/acl/role/',
  // 新增岗位的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有的职位
  UPDATEROLE_URL = '/admin/acl/role/update'
}
// 获取全部职位方法
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

// 对添加和更新职位的封装请求
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data);
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data);
  }
}
