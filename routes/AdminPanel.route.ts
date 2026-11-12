export const ADMIN_DASHBOARD='/admin/dashboard'



export const ADMIN_MEDIA_SHOW='/admin/media';
export const ADMIN_MEDIA_EDIT=(id:string)=>id?`/admin/media/edit/${id}`:""

//Category Route
export const ADMIN_CATERGORY='/admin/category'
export const ADMIN_CATERGORY_EDIT = (id: string) =>
  id ? `/admin/category/edit/${id}` : "";
export const ADMIN_CATERGORY_ADD='/admin/category/add'



//Product Route
export const ADMIN_PRODUCT='/admin/product'
export const ADMIN_PRODUCT_EDIT = (id: string) =>
  id ? `/admin/product/edit/${id}` : "";
export const ADMIN_PRODUCT_ADD='/admin/product/add'


//Product Varient Route
export const ADMIN_PRODUCT_Varient='/admin/product-varient'
export const ADMIN_PRODUCT_Varient_EDIT = (id: string) =>
  id ? `/admin/product-varient/edit/${id}` : "";
export const ADMIN_PRODUCT_Varient_ADD='/admin/product-varient/add'




//Coupon Route
export const ADMIN_COUPON='/admin/coupon'
export const ADMIN_COUPON_EDIT = (id: string) =>
  id ? `/admin/coupon/edit/${id}` : "";
export const ADMIN_COUPON_ADD='/admin/coupon/add'



//Customer Route
export const ADMIN_CUSTOMER='/admin/customer'
export const ADMIN_CUSTOMER_EDIT = (id: string) =>
  id ? `/admin/customer/edit/${id}` : "";
export const ADMIN_CUSTOMER_ADD='/admin/customer/add'


//Customer Route
export const ADMIN_REVIEW='/admin/review'


export const ADMIN_TRASH='/admin/trash'
