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
import { IoSunny } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "next-themes"

const ThemeSwitch = () => {
    const { setTheme } = useTheme()

  return (
    <div>
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" />}>
           <IoSunny className='block dark:hidden'/>                                               
           <IoMoonOutline  className='dark:block hidden'/>                                               
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
    </DropdownMenuGroup>
    
  </DropdownMenuContent>
</DropdownMenu>
        
    </div>
  )
}

export default ThemeSwitch