// get请求的数据类型

// 公共请求数据
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// data部分公共数据类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}
// 包含全部品牌数据的ts类型
export type Records = Trademark[]

// data全部数据
export interface TrademarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
