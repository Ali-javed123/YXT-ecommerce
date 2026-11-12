import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"
import { type MRT_ColumnDef } from 'material-react-table';



type CustomerType = {
  avatar?: string
  name: string
  email: string
  phone: string
  address: string
  isEmailVerify: boolean
}

export const DT_CATEGORY_COLUMN=[
          {
        accessorKey: 'name',
        header: 'Category Name', //uses the default width from defaultColumn prop
      },
        {
        accessorKey: 'slug',
        header: 'Category Slug', //uses the default width from defaultColumn prop
      },
]



export const DT_PRODUCT_COLUMN=[
          {
        accessorKey: 'name',
        header: 'Product Name', //uses the default width from defaultColumn prop
      },
        {
        accessorKey: 'slug',
        header: 'Category Slug', //uses the default width from defaultColumn prop
      },
       {
        accessorKey: 'category',
        header: 'Category', //uses the default width from defaultColumn prop
      },
      
       {
        accessorKey: 'mrp',
        header: 'MRP', //uses the default width from defaultColumn prop
      },
       {
        accessorKey: 'sellingPrice',
        header: 'Selling Price', //uses the default width from defaultColumn prop
      },
      {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage', //uses the default width from defaultColumn prop
      }
]



export const DT_PRODUCT_VARIANTS_COLUMN=[
          {
        accessorKey: 'product',
        header: 'Product Name', //uses the default width from defaultColumn prop
      },
        {
        accessorKey: 'size',
        header: 'Size', //uses the default width from defaultColumn prop
      },
       {
        accessorKey: 'color',
        header: 'Color', //uses the default width from defaultColumn prop
      },
      {
        accessorKey: 'sku',
        header: 'SKU', //uses the default width from defaultColumn prop
      },
       {
        accessorKey: 'mrp',
        header: 'MRP', //uses the default width from defaultColumn prop
      },
       {
        accessorKey: 'sellingPrice',
        header: 'Selling Price', //uses the default width from defaultColumn prop
      },
      {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage', //uses the default width from defaultColumn prop
      }
]


export const DT_COUPON_COLUMN=[
          {
        accessorKey: 'code',
        header: 'Coupon Code', //uses the default width from defaultColumn prop
      },
        {
        accessorKey: 'minShoppingAmount',
        header: 'Min Shopping Amount', //uses the default width from defaultColumn prop
      },
       {
  accessorKey: 'validity',
  header: 'Validity', // uses the default width from defaultColumn prop
  Cell: ({ cell }: any) => {
    const date = new Date(cell.getValue());
    return (
      <Chip
        color={new Date() > date ? 'error' : 'success'}
        label={date.toLocaleDateString('en-PK')}
      />
    );
  },
},
      {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage', //uses the default width from defaultColumn prop
      }
]


export const DT_CUSTOMERS_COLUMN: MRT_ColumnDef<CustomerType>[] = [

          {
        accessorKey: 'avatar',
        header: 'Avatar', //uses the default width from defaultColumn prop
        Cell:({render}:any)=>{
          return(
            <Avatar>
              <AvatarImage src={render? render?.src :'@public/assets/images/user.png'}/>
            </Avatar>
          )
        }
      },
         {
        accessorKey: 'name',
        header: 'Name', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'email',
        header: 'Email', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'phone',
        header: 'Phone No', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'address',
        header: 'Address', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'isEmailVerify',
        header: 'Is Verified', //uses the default width from defaultColumn prop
          Cell:({cell})=>{
                const isVerified = cell.getValue() ;
            return isVerified ? (
      <Chip label="Verified" color="success" />
    ) : (
      <Chip label="Not verified" color="error" />
    );

        }
      }
        
]
export const DT_REVIEWS_COLUMN: MRT_ColumnDef<CustomerType>[] = [

          
         {
        accessorKey: 'product',
        header: 'Product', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'user',
        header: 'user', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'title',
        header: 'Title', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'rating',
        header: 'Rating', //uses the default width from defaultColumn prop
        
      },
      {
        accessorKey: 'review',
        header: 'Review', //uses the default width from defaultColumn prop
        
      },
        
]