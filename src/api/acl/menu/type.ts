export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 接口data当中的数据
export interface Permission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children: []
  select: boolean
}

export type PermissionList = Permission[]

// 接口返回数据
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}

// 添加和修改的请求接口返回的数据类型
export interface MenuParams {
  id?: number
  code: string
  level: number
  pid: number
  name: string
}
