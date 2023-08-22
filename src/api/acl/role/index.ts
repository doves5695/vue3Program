// 角色管理模块接口
import request from "@/utils/request";
// 引入数据类型
import type { RoleResponseData } from "./type";
// 枚举接口
enum API {
    // 获取全部职位
    ALLROLE_URL = '/admin/acl/role/'
}
// 获取全部职位方法
export const reqAllRoleList = (page: number, limit:number, roleName:string) => request.get<any, RoleResponseData>(API.ALLROLE_URL+`${page}/${limit}/?roleName=${roleName}`)