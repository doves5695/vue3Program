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

// 菜单与按钮数据的ts类型
export interface MenuData {
  id:number,
  createTime:string,
  updateTime:string,
  pid:number,
  name:string,
  code:null,
  toCode:null,
  type:number,
  status:null,
  level:number,
  children:[],
  select: boolean,
}
export type MenuList = MenuData[];

// 该接口返回的数据类型s
export interface MenuResponseData extends ResponseData {
  data : MenuList
}

