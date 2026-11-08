import React,{useState,useEffect,useRef} from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogClose 
} from '../ui/dialog'
import { Button } from '../ui/button'
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import axios from 'axios';
 
import Image from 'next/image'
import MediaCheck from './MediaCheck';


import { useThrottle } from '@/lib/throttle' // apna sahi path dein
import { showToast } from '@/lib/showToast';
interface ModalType {
  open: boolean;
  setOpen: ((open: boolean) => void) | undefined;
  selectedMedia: any;
  setSelectedMedia: (sm: any[]) => void;
  isMultiple: boolean;
}






const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }: ModalType) => {
  const [prevState, setPrevState] = useState<any>([])


  useEffect(() => {
    if (open) {
      setPrevState(selectedMedia ?? [])
    }
  }, [open])

  const fetchMedia = async (page: number) => {
    const response = await axios.get(
      `/api/media?page=${page}&limit=18&deleteType=SD`
    );
    return response.data; // AxiosResponse ka actual data
  };


const handleClear = () => {

  setSelectedMedia([])
};

const handleClose=()=>{
  setSelectedMedia(prevState ?? [])
}

const handleSelect = () => {
  if(prevState?.length<=0){
    return showToast({type:'error',content:"please Select a media"})

  }
  setSelectedMedia(prevState??[])
  setOpen?.(false)
};
const SkeletonCards = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="h-[350px] w-full rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 animate-pulse"
      />
    ))}
  </>
)


const {isPending,isError,data,error,isFetching,fetchNextPage,hasNextPage,isFetchingNextPage}=useInfiniteQuery({
  queryKey:['MediaModal'],
  queryFn:({pageParam})=> fetchMedia(pageParam),
  placeholderData:keepPreviousData ,
  initialPageParam:0 ,
  getNextPageParam:(lastPage,allPages)=>{
const nextPage=allPages.length
return lastPage.hasMore?nextPage:undefined 
  }

})

  const allMedia = (data as any)?.pages?.flatMap((page: any) => page.mediaData) || [];
console.log("media modal",allMedia)




const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)
const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null)

const throttledFetch = useThrottle(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, 2500)

useEffect(() => {
  if (!scrollEl || !sentinelEl) return

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        throttledFetch()
      }
    },
    { root: scrollEl, rootMargin: '0px', threshold: 0 }
  )

  observer.observe(sentinelEl)
  return () => observer.disconnect()
}, [scrollEl, sentinelEl, throttledFetch])




  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(open) => setOpen?.(open)}
        disablePointerDismissal
      >
        
        <DialogContent
          // ✅ Title prop pass kar diya (Custom ui/dialog.tsx ki madad se)
          title="Media Selection"
          // ✅ Description prop pass kiya (screen readers aur accessibility ke liye zaroori hai)
          description="Select media files from the library" 
          // ✅ showCloseButton default true hai, X icon top-right par aayega
  className="w-[95vw] sm:max-w-[80vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden"

        >
          
          <div className="h-[calc(90vh-100px)]  text-foreground p-4 rounded-lg flex flex-col shadow-sm ">
            
            {/* Content Area */}
       <div className="flex flex-col flex-1 min-h-0 p-4 overflow-hidden">

  {/* Media Content */}
  <div 
  ref={setScrollEl}


  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">

      {allMedia.map((mediaData: any) => (
        <MediaCheck
            key={mediaData._id}

    media={mediaData}
    selectedMedia={selectedMedia}
    setSelectedMedia={setSelectedMedia}
    isMultiple={isMultiple}
    setPrevState={setPrevState}
    prevState={prevState}

        />
      ))}


                      {(isPending || isFetchingNextPage) && <SkeletonCards count={5} />}
              <div ref={setSentinelEl} className="h-10" />
 
              {!hasNextPage && allMedia.length > 0 && (
                <p className="text-center text-sm text-gray-500 py-3">
                  No more media found
                </p>
              )}



    </div>

    
    
  </div>
  {/* Footer */}
  <div className="shrink-0 pt-4 mt-4 border-t border-border flex justify-between items-center">

<div className=' flex h-10 w-full justify-between items-center'>
  <div>
    <Button variant="destructive" onClick={handleClear}>
  Clear All
</Button>
  </div>
  {/* <div>


     {hasNextPage && (
     <Button onClick={() => fetchNextPage()} disabled={isFetching}>
       {isFetching ? "Loading..." : "Load more"}
     </Button>
   )}
  </div> */}

<div>

<Button onClick={handleSelect}>Select</Button>
</div>


  
<div>


</div>
</div>



  </div>
</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MediaModal