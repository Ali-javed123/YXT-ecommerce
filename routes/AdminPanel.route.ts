export const ADMIN_DASHBOARD='/admin/dashboard'



export const ADMIN_MEDIA_SHOW='/admin/media';
export const ADMIN_MEDIA_EDIT=(id:string)=>id?`/admin/media/edit/${id}`:""

//Category Route
export const ADMIN_CATERGORY='/admin/category'
export const ADMIN_CATERGORY_EDIT = (id: string) =>
  id ? `/admin/category/edit/${id}` : "";
export const ADMIN_CATERGORY_ADD='/admin/category/add'


export const ADMIN_TRASH='/admin/trash'
