'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import img from '../../assets/images/favicon.ico'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from 'react-redux'

import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import Link from 'next/link'

import {logout} from '../../store/reducer/authReducer'
import { MdLogout } from "react-icons/md";


import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/website.route'
const UserDropdown = () => {
    const router=useRouter()
  const dispatch =useDispatch()
  const auth=useSelector((store:any)=>store.authStore.auth)
console.log("auth:",auth)

  const Logout = async () => {
  try {
    const { data } = await axios.post("/api/auth/logout")

    if (!data.success) {
      throw new Error(data.message)
    }

    dispatch(logout())

    console.log("Logout dispatched")

    showToast({
      type: "success",
      content: data.message
    })

    router.push(WEBSITE_LOGIN)

  } catch (error: any) {
    showToast({
      type: "error",
      content: error.message
    })
  }
}
  return (
    <>
  <DropdownMenu >
  <DropdownMenuTrigger >
    <Avatar>
  <AvatarImage src={img.src} />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className={'w-54'}>
  <DropdownMenuGroup>
  <DropdownMenuLabel>
    <p className='font-semibold'>
      {auth?.name}
    </p>
    <span className='font-normal text-sm'>{auth?.email??"muhammadaliadil999@gmail.com"}  </span>
  </DropdownMenuLabel>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuGroup className={"py-2"}>
  <DropdownMenuItem render={<Link href={''} className='cursor-pointer'/>}>
    <IoShirtOutline/>
    New Product
  </DropdownMenuItem>
   <DropdownMenuItem render={<Link href={''} className='cursor-pointer'/>}>
    <MdOutlineShoppingBag/>
    Orders
  </DropdownMenuItem>
  <DropdownMenuItem
  onClick={Logout}
  >

  <div className='flex items-center ps-1 gap-1 justify-center'>

<MdLogout color='red' />
Logout
  </div>
  </DropdownMenuItem>
  
  </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
    
    </>
  )
}

export default UserDropdown