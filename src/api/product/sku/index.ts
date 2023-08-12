// sku模块的接口
import request from "@/utils/request";
// 枚举接口地址
enum APi {
    // 获取已有的商品的数据-sku
    SKU_URL = 'admin/products/list/'
}

// 获取商品sku的请求
export const reqSkuList = (page: number, limit: number) => request.get<any,any>(APi.SKU_URL+`${page}/${limit}`);