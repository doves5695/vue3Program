// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// spu数据的ts类型: 未来需要修改
export interface SpuData {
  category3Id: string | number
  id?: number
  spuName: string
  description: string
  tmId: string | number
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImg[]
}

// 数组: 元素已经有SPU数据类型
export type Records = SpuData[]

// 定义接口返回的data类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据ts类型
export interface AllTrademark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}

// 已存在的spu的照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象的ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组类型
export type spuSaleAttrValueList = SaleAttrValue[]

// 销售属性返回data的数据类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// 服务器返回的全部数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有全部spu返回的销售属性数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}
// 服务器返回的spu销售属性的data的ts类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //属性值的ID
}

export interface saleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}

export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string //sku图片地址

}
