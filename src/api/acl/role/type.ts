export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 职位的数据类型
export interface RoleData {
  id?: number
  createTime?: number
  updatedTime?: number
  roleName: string
  remark?: null
}

// 包含职位的数组
export type Records = RoleData[]

// 全部职位返回的数据
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}
