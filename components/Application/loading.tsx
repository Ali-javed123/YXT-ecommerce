import React from 'react'
import loadingImage from '../../public/assets/images/loading.svg'
import Image from 'next/image'
const Loading = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center mt-12'>
        <Image src={loadingImage.src} alt="loading" width={80} height={80}></Image>
    </div>
  )
}

export default Loading