// SPU管理模块接口
import request from '@/utils/request';
// 引入数据类型
import type { HasSpuResponseData } from './type';
enum API {
    // 获取接口当中已有的spu数据
    HASSPU_URL = '/admin/product/'
}
// 获取某一个已有的三级分类下spu数据
export const reqHasSpu = (page:number, limit: number, category3Id: string | number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL+ `${page}/${limit}?category3Id=${category3Id}`);