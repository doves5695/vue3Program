// 账户信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 代表一个账号信息的ts类型
export interface User {
  id?: number
  createTime: string
  updateTime: string
  username?: string
  password?: string
  name?: string
  phone: null
  roleName: string
}

// 接口返回的data当中的数组
export type Records = User[]

// 获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}
