import { ADMIN_CATERGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/routes/AdminPanel.route'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'
import { RiCoupon2Line } from 'react-icons/ri'
import { MdOutlinePermMedia } from 'react-icons/md'
const QuickAdd = () => {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5 mt-5">
        <Link  href={ADMIN_CATERGORY_ADD}>
            <div className='bg-card bg-linear-to-tr from-green-400 via-green-600 to-green-900 h-16 rounded-md  p-3 flex justify-between items-center'>
                
                <h2 className='text-lg  font-semibold dark:text-white text-white '>Add Category</h2>
            <span className='size-11 flex items-center justify-center rounded-full border border-white'>
                    <BiCategory className='text-white ' size={25}/>

                </span>
            </div>
        </Link>
          <Link  href={ADMIN_PRODUCT_ADD}>
            <div className='bg-card bg-linear-to-tr from-blue-400 via-blue-600 to-blue-900 h-16 rounded-md  p-3 flex justify-between items-center'>
                
                <h2 className='text-lg  font-semibold dark:text-white text-white '>Add Product</h2>
            <span className='size-11 flex items-center justify-center rounded-full border border-white'>
                    <IoShirtOutline className='text-white ' size={25}/>

                </span>
            </div>
        </Link>
          <Link  href={ADMIN_COUPON_ADD}>
            <div className='bg-card bg-linear-to-tr from-purple-400 via-purple-600 to-purple-900 h-16 rounded-md  p-3 flex justify-between items-center'>
                
                <h2 className='text-lg  font-semibold dark:text-white text-white '>Add Coupon</h2>
            <span className='size-11 flex items-center justify-center rounded-full border border-white'>
                    <RiCoupon2Line className='text-white ' size={25}/>

                </span>
            </div>
        </Link>
          <Link  href={ADMIN_MEDIA_SHOW}>
            <div className='bg-card bg-linear-to-tr from-cyan-400 via-cyan-600 to-cyan-900 h-16 rounded-md  p-3 flex justify-between items-center'>
                
                <h2 className='text-lg  font-semibold dark:text-white text-white '>Add Media</h2>
            <span className='size-11 flex items-center justify-center rounded-full border border-white'>
                    <MdOutlinePermMedia className='text-white ' size={25}/>

                </span>
            </div>
        </Link>
    </div>
  )
}

export default QuickAdd