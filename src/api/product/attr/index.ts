// 书写属性相关的api文件
import request from '@/utils/request'
import type { CategoryResponseData,AttrResponseData } from './type'

// 枚举api
enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性和属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或修改属性的接口
  ADDORUPDATEATTR_URL= '/admin/product/saveAttrInfo'
}




// 获取一级分类的接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
// 获取二级分类的接口
export const reqC2 = (catrgory1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + catrgory1Id)
// 获取三级分类的接口
export const reqC3 = (catrgory2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + catrgory2Id)

// 获取分类下已有的数据的接口
export const reqAttr = (catrgory1Id: number | string,catrgory2Id: number | string,catrgory3Id: number | string) => request.get<any,AttrResponseData>(API.ATTR_URL+ `${catrgory1Id}/${catrgory2Id}/${catrgory3Id}`);

// 修改或增加数据的接口
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any,any>(API.ADDORUPDATEATTR_URL, data);