'use client'
import React from 'react'
import UserDropdown from './UserDropdown'
import ThemeSwitch from './ThemeSwitch'
import { Button } from '../ui/button'
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from '../ui/sidebar';
import { MdLogout } from 'react-icons/md'

const TopBar = () => {
  const {toggleSidebar}=useSidebar()
  return (
    <div className="flex fixed right-0 h-16  justify-between items-center  top-0 px-6 left-0 z-30 px-4 md:left-64 bg-white dark:bg-card border-b">
  <div>
    <p>Search</p>
        </div>
        <div className='flex items-center gap-2'>
        <UserDropdown/>
         <ThemeSwitch/>
         <Button onClick={toggleSidebar} type='button' className={'md:hidden'} size={'icon'}>
<RiMenu4Fill className='text-white'/>
         </Button>
         
        </div>
      
    </div>
  )
}

export default TopBar