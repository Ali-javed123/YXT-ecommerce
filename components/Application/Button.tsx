import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button as Buttun } from '../ui/button'
import { cn } from '@/lib/utils'
const ButtonLoading = ({type,text,loading,onClick=null,className, ...props}:any) => {
  return (
    <div>
        <Buttun 
        onClick={onClick}
         {...props}
          className={cn("",className)}
           type={type}
            disabled={loading}
            >
            {loading &&
            <Loader2 className='animate-spin'/>

        }
        {text}

        </Buttun>


    </div>
  )
}

export default ButtonLoading