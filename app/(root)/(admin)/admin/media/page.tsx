"use client"
import Breadcrum from '@/components/Application/Breadcrum'
import React, { useEffect, useState,useRef } from 'react'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanel.route'

import UploadMedia from '@/components/Application/Admin/UploadMedia'
import type { Breadcrum as breadcrum } from '@/types/breadcrum'
import { Card, CardHeader,CardContent } from '@/components/ui/card'
import axios from 'axios'

import Image from 'next/image'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import Media from '@/components/Application/Admin/Media'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutation'

 import { useThrottle } from '@/lib/throttle'



 const SkeletonCards = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="min-h-70 w-full rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 animate-pulse"
      />
    ))}
  </>
)

const page = () => {
  const queryClient=useQueryClient()
  const [deleteType,setdeleteType]=useState("SD")
  const [SelectedMedia,setSelectedMedia]=useState<string[]>([])
  const [selectAll,setSelectAll]=useState(false)

  const searchParams=useSearchParams()

  const loadMoreRef = useRef<HTMLDivElement | null>(null)


  useEffect(()=>{
    if(searchParams){
      const trashOf=searchParams.get("trashof")
      setSelectedMedia([])
      if(trashOf){
        setdeleteType("PD") //set deleted data 
      }else{
        setdeleteType("SD") //set non deleted 
      }

    }
    

  },[deleteType,searchParams])







     const breadcrum:breadcrum[]=[
            {href:ADMIN_DASHBOARD,label:"Dashboard"},
            {href:ADMIN_MEDIA_SHOW,label:"Media"},
        ]

          const fetchMedia = async (page: number, deleteType: string) => {
    const response = await axios.get(
      `/api/media?page=${page}&limit=10&deleteType=${deleteType}`
    )

    return response.data
  }
console.log("selectAll:",selectAll)




  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media", deleteType],

    queryFn: ({ pageParam }) =>
      fetchMedia(pageParam, deleteType),

    initialPageParam: 0,

    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length
      }

      return undefined
    },
  })

  console.log("Media data",data)



const throttledFetch = useThrottle(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, 2500)

useEffect(() => {
  const el = loadMoreRef.current
  if (!el) return

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        throttledFetch()
      }
    },
    { root: null, rootMargin: "0px", threshold: 0 }
  )

  observer.observe(el)
  return () => observer.disconnect()
}, [throttledFetch])


const allMedia = data?.pages?.flatMap((page: any) => page?.mediaData) ?? []
  console.log("datas",allMedia)

// setSelectedMedia(datas)
console.log("SelectedMedia",SelectedMedia)

const deleteMutation=useDeleteMutation("media",'/api/media/delete')



const handleDelete = (
  selectedMedia: string[],
  deleteType: any
) => {
  if (deleteType === "PD") {
    const yesNO = confirm(
      "Are you sure you want to permanently delete all data?"
    );

    if (!yesNO) return;
  }

  deleteMutation.mutate({
    ids: selectedMedia,
    deleteType,
  });

  setSelectAll(false);
  setSelectedMedia([]);
};

console.log("DeleteType:",deleteType)
  const handleSelectAll=()=>{

    setSelectAll(!selectAll)
  }

//all select media
useEffect(() => {
  if(selectAll){
    const allMedia = data?.pages?.flatMap((page:any)=>page?.mediaData?.map((media:any)=>media?._id)) ?? []
    setSelectedMedia(allMedia)
  }else{
    setSelectedMedia([])
  }
}, [selectAll, data])

  // useEffect(() => {
    
  //   const ids=data?.pages.map((e:any)=>e.mediaData.map((m:any)=>m._id)) 
  //   console.log('ids:',ids)
  // }, [selectAll])
  
  console.log("SelectedMedia",SelectedMedia)
  return (
    <div>
        <Breadcrum data={breadcrum}/>
        <div className='mt-5'>

        <Card className='py-0 rounded  shadow-sm '>
          <CardHeader className='py-2 px-4 [.border-b]:pb-2'>
            <div className='flex justify-between items-center'>
              <h4 className='text-black dark:text-gray-300 font-bold text-2xl'>Media</h4>
              <div className='flex  items-center'>
     {deleteType=="SD"&& <UploadMedia
      isMultiple maxFiles={10}
      
                 queryClient={queryClient}

      />}  
        <div className="flex gap-4 items-center">

        {deleteType=="SD"?
        <Button type='button' variant={'destructive'}>
          <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
          Trash
          </Link>
        </Button>:deleteType=="PD"?
        <Button type='button' >
          <Link href={`${ADMIN_MEDIA_SHOW}`}>
          Back to Media
          </Link>
        </Button>:
        <></>
      }
        </div>


              </div>

            </div>
          </CardHeader>
            {SelectedMedia.length>0&&
            <div className='px-5'>


          <div className='py-2 px-3 bg-blue-300  md-2 rounded flex items-center justify-between'>
            <Label>
              <Checkbox
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              className={'border border-white'}
              />
              Select All
            </Label>
            <div className="flex gap-2">
            {deleteType=="SD"?
            <Button 
            variant="destructive" 
            
           onClick={()=>handleDelete(SelectedMedia,"SD")}
            
            >Move into Trash</Button>:
            <>
            
            
            <Button 
           variant="destructive"
           className="bg-green" 
           onClick={()=>handleDelete(SelectedMedia,"RSD")}
           >Restore</Button>
            <Button 
           variant="destructive"
           onClick={()=>handleDelete(SelectedMedia,deleteType)}
           >Delete Permanantly</Button>
            </>
            
          }

            </div>

          </div>
            </div>

          }

          <CardContent>
            {status==='pending'?
          <div>Loading...</div>:
          status==="error"?
          <div className="text-red-500">{error.message}</div>:
          <></>
          }
<>
{data?.pages?.flatMap((page:any)=>page?.mediaData?.map((media:any)=>media?._id)).length==0 && 
<div ><h2 className="text-lg font-bold my-2"> Media not found</h2></div>}

<div className="grid grid-cols-2  gap-x-2 gap-y-1 lg:grid-cols-5 sm:grid-cols-3">
               {allMedia && allMedia?.length > 0 && (

               allMedia?.map((media:any,i:number)=>(

            <div key={i} className=''>
              {/* <div className='absolute h-[40vh] w-full top-0 left-0'>
              <Image src={e.url} objectFit='cover' alt='media' fill></Image>
              </div> */}
              <Media 
           media={media}
           key={i}
           handleDelete={handleDelete}
           deleteType={deleteType}
           setSelectedMedia={setSelectedMedia}
           selectedMedia={SelectedMedia}
           />


            </div>
            ))

            )}
              {(status === "pending" || isFetchingNextPage) && <SkeletonCards count={5} />}

          </div>

                      <div ref={loadMoreRef} className="h-10" />

            {!hasNextPage && allMedia.length > 0 && (
              <p className="text-center text-sm text-gray-500 py-3">
                No more media found
              </p>
            )}

</>
          </CardContent>
        
        </Card>

        </div>
    </div>
  )
}

export default page