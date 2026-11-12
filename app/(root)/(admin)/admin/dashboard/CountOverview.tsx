'use client'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'
import { useFetch } from '@/hooks/useFetch'
import { ADMIN_CATERGORY, ADMIN_CUSTOMER, ADMIN_PRODUCT } from '@/routes/AdminPanel.route'
interface  Count {
    category:number
    product:number
    customer:number
}
const CountOverview = () => {
    const {data} =useFetch('/api/dashboard/admin/count')
    const totalCount=data as Count
    console.log("count",data)
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5">
        <Link href={ADMIN_CATERGORY}>
        <div className=' bg-card rounded-sm  p-3 border-l-4 border-green-600 flex justify-between items-center h-[75px]  shadow-sm'>
            <div>
                <p className=' dark:text-gray-300 text-gray-400 font-bold text-md'>
                    Total Categories
                </p>
                <h4 className='text-xl  font-extrabold dark:text-white text-black '>
                    {totalCount?totalCount.category:''}
                </h4>
            </div>
            <div className='size-11 flex items-center justify-center rounded-full  bg-green-600'>
                <span><BiCategory className='text-white text-2xl'/></span>
            </div>
        </div>
        </Link>

        <Link href={ADMIN_PRODUCT}>
        <div className=' bg-card rounded-sm  p-3 border-l-4 border-blue-600 flex justify-between items-center h-[75px]  shadow-sm'>
            <div>
                <p className=' dark:text-gray-300 text-gray-400 font-bold text-md'>
                    Total  Products

                </p>
                <h4 className='text-xl  font-extrabold dark:text-white text-black '>
                    {totalCount?totalCount.product:''}

                </h4>
            </div>
            <div className='size-11 flex items-center justify-center rounded-full  bg-blue-600'>
                <span><IoShirtOutline className='text-white text-2xl'/></span>
            </div>
        </div>
        </Link>
        <Link href={ADMIN_CUSTOMER}>
        <div className=' bg-card rounded-sm  p-3 border-l-4 border-purple-600 flex justify-between items-center h-[75px]  shadow-sm'>
            <div>
                <p className=' dark:text-gray-300 text-gray-400 font-bold text-md'>
                    Total  Customer

                </p>
                <h4 className='text-xl  font-extrabold dark:text-white text-black '>
                    {totalCount?totalCount.customer:''}

                </h4>
            </div>
            <div className='size-11 flex items-center justify-center rounded-full  bg-purple-600'>
                <span><LuUserRound className='text-white text-2xl'/></span>
            </div>
        </div>
        </Link>
        <Link href={''}>
        <div className=' bg-card rounded-sm  p-3 border-l-4 border-cyan-400 flex justify-between items-center h-[75px]  shadow-sm'>
            <div>
                <p className=' dark:text-gray-300 text-gray-400 font-bold text-md'>
                    Total Order
                </p>
                <h4 className='text-xl  font-extrabold dark:text-white text-black '>
                    35
                </h4>
            </div>
            <div className='size-11 flex items-center justify-center rounded-full  bg-cyan-400'>
                <span><MdOutlineShoppingBag className='text-white text-2xl'/></span>
            </div>
        </div>
        </Link>

        
    </div>
  )
}

export default CountOverview