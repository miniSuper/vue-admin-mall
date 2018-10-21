import request from '@/utils/request'
// 获取商品列表
export function getGoodsList (params) {
  return request({
    url: '/admin/goods/goodslist',
    method: 'get',
    params
  })
}
// 获取回收站列表
export function getGoodsDeleteList (params) {
  return request({
    url: '/admin/goods/deletegoodslist',
    method: 'get',
    params
  })
}
// 获取回收站列表
export function getGoodsWarningList (params) {
  return request({
    url: '/admin/goods/goodsstockwarning',
    method: 'get',
    params
  })
}
// 发布商品步骤之 发布商品基本信息
export function addGoods (data) {
  return request({
    url: '/admin/goods/InsertGoods',
    method: 'post',
    data
  })
}
// 发布商品步骤之 发布商品类型
export function commitGoodsType (data) {
  return request({
    url: '/admin/goods/InsertGoodsAttribute',
    method: 'post',
    data
  })
}
// 发布商品步骤之 发布商品规格
export function commitGoodsModel (data) {
  return request({
    url: '/admin/goods/InsertGoodsSku',
    method: 'post',
    data
  })
}
// 发布商品步骤之 发布商品详情
export function commitGoodsDetails (data) {
  return request({
    url: '/admin/goods/insertGoodsDetail',
    method: 'post',
    data
  })
}
// 发布商品步骤之 发布商品图片
export function commitGoodsMedia (data) {
  return request({
    url: '/admin/goods/InsertGoodsMedia',
    method: 'post',
    data
  })
}
// 发布商品步骤之 删除商品详情图
export function deleteGoodsDetailImgs (data) {
  return request({
    url: '/admin/goods/DeleteGoodsPics',
    method: 'post',
    data
  })
}
// 发布商品步骤之 删除商品首图
export function deleteGoodsAvatar (data) {
  return request({
    url: '/admin/goods/DeleteGoodsPic',
    method: 'post',
    data
  })
}
// 发布商品步骤之 【获取】商品基本信息
export function getGoodsBasicInfo (id) {
  return request({
    url: '/admin/goods/GoodsBasicInfo',
    method: 'get',
    params: {
      goods_id: id
    }
  })
}
// 发布商品步骤之 【获取】商品类型信息
export function getGoodsTypeInfo (id) {
  return request({
    url: '/admin/goods/GetGoodsAttribute',
    method: 'get',
    params: {
      goods_id: id
    }
  })
}
// 发布商品步骤之 【获取】商品规格sku信息
export function getGoodsSkuInfo (id) {
  return request({
    url: '/admin/goods/GetGoodsSpec',
    method: 'get',
    params: {
      goods_id: id
    }
  })
}
// 发布商品步骤之 【获取】商品媒体信息
export function getGoodsMediaInfo (id) {
  return request({
    url: '/admin/goods/GetGoodsMedia',
    method: 'get',
    params: {
      goods_id: id
    }
  })
}
// 发布商品步骤之 【获取】商品详情
export function getGoodsDetailsInfo (id) {
  return request({
    url: '/admin/goods/GetGoodsDetail',
    method: 'get',
    params: {
      goods_id: id
    }
  })
}
// 删除商品 单个或批量 id: 1,2,3,4...
export function deleteGoods (id) {
  return request({
    url: '/admin/goods/deleteGoods',
    method: 'post',
    data: {
      goods_ids: id
    }
  })
}
// 彻底删除 摧毁 商品 单个或批量
export function destroyGoods (ids) {
  return request({
    url: '/admin/goods/emptyDeleteGoods',
    method: 'post',
    data: {
      goods_ids: ids
    }
  })
}
// 下架商品 单个或批量 id: 1,2,3,4...
export function offLineGoods (id) {
  return request({
    url: '/admin/goods/modifyGoodsOnline',
    method: 'post',
    data: {
      goods_ids: id,
      status: 0
    }
  })
}
// 上架商品 单个或批量 id: 1,2,3,4...
export function onLineGoods (id) {
  return request({
    url: '/admin/goods/modifyGoodsOnline',
    method: 'post',
    data: {
      goods_ids: id,
      status: 1
    }
  })
}

// 添加商品类型
export function addGoodsAttribute (data) {
  return request({
    url: '/admin/goods/addAttribute',
    method: 'post',
    data
  })
}
// 添加商品规格
export function addGoodsModel (data) {
  return request({
    url: '/admin/goods/addGoodSpec',
    method: 'post',
    data
  })
}
// 获取规格列表
export function getModelList (params) {
  return request({
    url: '/admin/goods/goodsSpecList',
    method: 'get',
    params
  })
}
// 获取单个商品规格
export function getGoodsModel (id) {
  return request({
    url: '/admin/goods/updataGoodsSpec',
    method: 'get',
    params: {
      spec_id: id
    }
  })
}
// 修改某个商品规格
export function updateGoodsModel (data) {
  return request({
    url: '/admin/goods/updataGoodsSpec',
    method: 'post',
    data
  })
}
// 删除商品规格
export function delGoodsModel (idsStr) {
  return request({
    url: '/admin/goods/delGoodsSpe',
    method: 'post',
    data: {
      spec_id: idsStr
    }
  })
}
// 获取商品类型列表
export function getGoodsTypeList (params) {
  return request({
    url: '/admin/goods/AttriButeList',
    method: 'get',
    params
  })
}
// 获取单个商品类型
export function getGoodsType (id) {
  return request({
    url: 'admin/goods/updategoodsattribute',
    method: 'get',
    params: {
      attr_id: id
    }
  })
}
// 添加商品类型
export function addGoodsType (data) {
  return request({
    url: '/admin/goods/addAttribute',
    method: 'post',
    data
  })
}
// 更新商品类型
export function updateGoodsType (data) {
  return request({
    url: '/admin/goods/updategoodsattribute',
    method: 'post',
    data
  })
}
// 删除商品类型
export function deleteGoodsType (ids) {
  return request({
    url: '/admin/goods/deleteAttribute',
    method: 'post',
    data: {
      attr_id: ids
    }
  })
}
// 删除商品类型 的 某个属性值
export function deleteGoodsTypeAttr (id, attrId) {
  return request({
    url: '/admin/goods/deleteAttributeValue',
    method: 'post',
    data: {
      attr_id: id,
      attr_value_id: attrId
    }
  })
}
// 更新商品类型 的 某个属性值
export function updateGoodsTypeAttr (data) {
  return request({
    url: 'admin/goods/modifyattribute',
    method: 'post',
    data
  })
}
// 获取品牌列表
export function getBrandList (params) {
  return request({
    url: '/admin/goods/goodsBrandList',
    method: 'get',
    params
  })
}
// 添加品牌
export function addGoodsBrand (data) {
  return request({
    url: '/admin/goods/addGoodsBrand',
    method: 'post',
    data
  })
}
// 获取单个商品品牌
export function getGoodsBrand (id) {
  return request({
    url: '/admin/goods/updateGoodsBrand',
    method: 'get',
    params: {
      brand_id: id
    }
  })
}
// 获取单个商品品牌
export function updateGoodsBrand (data) {
  return request({
    url: '/admin/goods/updateGoodsBrand',
    method: 'post',
    data
  })
}
// 删除商品品牌
export function delGoodsBrand (idsStr) {
  return request({
    url: '/admin/goods/delGoodsBrand',
    method: 'post',
    data: {
      brand_id: idsStr
    }
  })
}
// 获取标签列表
export function getGoodsLabelList (params) {
  return request({
    url: '/admin/goods/GetGoodsLabelList',
    method: 'get',
    params
  })
}
// 添加商品标签
export function addGoodsLabel (data) {
  return request({
    url: '/admin/goods/addgoodslabel',
    method: 'post',
    data
  })
}
// 获取商品标签
export function getGoodsLabel (id) {
  return request({
    url: '/admin/goods/GoodsLabelUpdate',
    method: 'get',
    params: {
      label_id: id
    }
  })
}

// 更新商品标签
export function updateGoodsLabel (data) {
  return request({
    url: '/admin/goods/GoodsLabelUpdate',
    method: 'post',
    data
  })
}
// 删除商品标签
export function deleteGoodsLabel (ids) {
  return request({
    url: '/admin/goods/goodslabeldelete',
    method: 'post',
    data: {
      label_id: ids
    }
  })
}
// 获取商品分类列表
export function getGoodsCategoryList () {
  return request({
    url: '/admin/goods/goodscategorylist',
    method: 'get'
  })
}
// 添加商品分类
export function addGoodsCategory (data) {
  return request({
    url: '/admin/goods/addgoodscategory',
    method: 'post',
    data
  })
}
// 删除商品分类
export function deleteGoodsCategory (id) {
  return request({
    url: '/admin/goods/deleteGoodsCategory',
    method: 'post',
    data: {
      category_id: id
    }
  })
}
// 更新商品分类
export function updateGoodsCategory (data) {
  return request({
    url: '/admin/goods/addgoodscategory',
    method: 'post',
    data
  })
}
