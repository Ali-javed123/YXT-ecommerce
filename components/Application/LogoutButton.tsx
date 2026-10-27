import { showToast } from '@/lib/showToast'
import axios from 'axios'
import React from 'react'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/website.route'
const LogoutButton = () => {
  const router=useRouter()
    
  return (
    <div>LogoutButton</div>
  )
}

export default LogoutButton