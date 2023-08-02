// 分类相关数据的ts类型

// 公共类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 分类ts类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 分类接口返回的data类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性与属性值的接口

// 属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId?: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
// 存储每一个属性对象的数组的ts类型
export type AttrList = Attr[]
// 接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
