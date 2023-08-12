// SPU管理模块接口
import request from '@/utils/request'
import { da } from 'element-plus/es/locale'
// 引入数据类型
import type {
  SpuData,
  HasSpuResponseData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SkuData,
  SkuInfoData
} from './type'
enum API {
  // 获取接口当中已有的spu数据
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 某一spu当中的图片列表
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某一个已有的销售属性的接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加或保存一个新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新一个新的spu
  UPDATE_URL = '/admin/product/updateSpuInfo',
  // 追加一个SKU的接口地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有spu下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的spu
  REMOVE_URL = '/admin/product/deleteSpu/'
}
// 获取某一个已有的三级分类下spu数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部的spu的品牌的数据
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

// 获取某一spu下的图片的列表
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

// 获取某一个已有的spu拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加或更新一个新的spu
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果有id那么就是更新
  if (data.id) {
    return request.post<any, any>(API.UPDATE_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加sku请求的方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取sku数据
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL+spuId);

// 删除已有的spu
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVE_URL+spuId);