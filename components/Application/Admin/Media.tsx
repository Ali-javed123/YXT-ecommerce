  "use client"

  import React from 'react'
  import { Checkbox } from "@/components/ui/checkbox"
  import { Field, FieldGroup } from "@/components/ui/field"
  import Image from 'next/image'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { BsThreeDotsVertical } from "react-icons/bs"
  import Link from 'next/link'
  import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanel.route'
  import { MdOutlineEdit } from 'react-icons/md'
  import { IoIosLink } from 'react-icons/io'
  import { LuTrash } from 'react-icons/lu'
  import { showToast } from '@/lib/showToast'
  interface MediaProps {
    media: any
    handleDelete: any
    deleteType: any
    selectedMedia: any
    setSelectedMedia: any
  }


 

  const Media = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia }: MediaProps) => {
    const handleCheck = () => {
    let newSelectedMedia=[] 
    if(selectedMedia.includes(media._id)){
      newSelectedMedia=selectedMedia.filter((id:any)=>id!==media._id )
    }else{
      newSelectedMedia=[...selectedMedia,media._id]
    }
    setSelectedMedia(newSelectedMedia)

    }

console.log("selectedMedia:",selectedMedia,"media",media)
    const handleCopyLink=async(url:string)=>{
      await navigator.clipboard.writeText(url)
      showToast({type:"success",content:"Link copied."})

    }
    return (
      <div className='group min-h-60 w-full border border-gray-200 dark:border-gray-500 relative rounded overflow-hidden'>

        {/* Image sabse neeche */}
        <Image fill src={media.url} className="object-cover" alt={media.alt || 'media'} />

        {/* Overlay: click ko rokna nahi chahiye */}
        <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-150 ease-in group-hover:bg-black/30" />

        {/* Checkbox */}
        <div className='absolute top-1 left-1 z-20'>
          <FieldGroup className="w-fit">
            <Field orientation="horizontal">
              <Checkbox
                className="border-2 border-cyan-400"
                checked={selectedMedia.includes(media._id)}
                onCheckedChange={handleCheck}
              />
            </Field>
          </FieldGroup>
        </div>

        {/* Dropdown */}
        <div className='absolute top-1 right-1 z-20'>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  // onClick={()=>handleDelete(selectedMedia,deleteType)}
                  className="w-7 h-7 flex justify-center items-center rounded-full bg-black/50 cursor-pointer"
                />
              }
            >
              <BsThreeDotsVertical className="text-white" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Test item</DropdownMenuItem>

              {deleteType === "SD" && (
                  <>
                  
                <DropdownMenuItem className={'cursor-pointer'} render={<Link href={ADMIN_MEDIA_EDIT(media._id)} />}>
                  <MdOutlineEdit />
                <span className='text-[13px]'>Edit</span> 
                </DropdownMenuItem>
                  <DropdownMenuItem className={'cursor-pointer'} onClick={()=>handleCopyLink(media.url)} render={<Link href={""} />}>
                  <IoIosLink />
                <span className='text-[13px] cursor-pointer'> Copy Link </span>
                </DropdownMenuItem>
                  </>
                  

                  
              )}
                <DropdownMenuItem onClick={()=>handleDelete([media._id],deleteType)}  className={'cursor-pointer'} render={<Link href={''} />}>
                  <LuTrash className='text-[11px] font-normal' />
                  {deleteType === "SD"?<span className='text-[13px] '>  Move into Trash</span>:
                  <span className='!text-[10px] cursor-pointer'> Delete Permanently</span> }
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  export default Media