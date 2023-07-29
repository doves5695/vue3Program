// 品牌管理模块接口

import request from '@/utils/request'
import type { TrademarkResponseData, Trademark } from './type'

// 品牌管理模块接口地址

enum API {
  // 获取已经有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有的
  DELETE_URL  = '/admin/product/baseTrademark/remove/'
}
// 获取已有品牌的接口方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加与修改已有品牌接口方法
export const reqADDOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETE_URL + id);