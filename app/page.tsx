// // 'use client'
// // import React, { useState } from 'react'
// // import { Button } from '@/components/ui/button'
// // import { FaEdit } from 'react-icons/fa'
// // import { TiTick } from "react-icons/ti";
// // import { FaTrash } from 'react-icons/fa';
// // import axios from 'axios';
// // const Page = () => {
// // type Todo={
// //   text:string,
// //   id:number | string,

// // }
// //   const [text,setText]=useState<string>('')
// //   const [todo,setTodo]=useState<Todo[]>([])
// //   const [filterId,setFIlterId]=useState<number|string>()
// //   const [EditText,setEditText]=useState('')


// //   const addTodo=async()=>{
// //     const obj:Todo={
// //       text:text,
// //       id:Date.now(),
     
// //     }
// //     setTodo([...todo,obj])
// //     setText('')
// //     const response=await axios.post('/api/todo')
// //     return response


// //   }

// //   const update=(e:number)=>{
    
// // const obj:any={
  
// //       text:EditText,
     
// //     }

// //   setTodo((prev) =>
// //     prev.map((item) =>
// //     item._id===filterId?
// //   {...item,text:EditText}:
// //   item
// // ));
// //   setFIlterId('')

    

// //   }

// //   const deletedTodos=(id:any)=>{
// //     console.log("deletedID",id)
// //   const del = todo.filter((e) => e._id !== id)
// //     console.log("dele",del)
// //   setTodo(del)

// //   }
// //   console.log("todo",todo)
// //   console.log("filterId",filterId)
// //   console.log("EditText",EditText)
// //   return (
// //     <div className='w-full h-screen flex justify-center items-center'>

// //  <div className='w-md h-1/2 shadow-sm  '>
// //  <div className='flex gap-2 h-7 w-full justify-center items-center'>

// //   <div className=' '>
// //     <input type="text" 
// //     onChange={(e:any)=>setText(e.target.value)}
// //      value={text}
// //      className='bg-gray-200 h-10 w-3xs rounded-sm text-black border-2'
// //               //  onKeyDown={(e) => e.key === "Enter" && addTodo()}


// //      />
// //   </div>
// //   <div>
// //     <button onClick={()=>addTodo()} className='bg-blue-500 mb-2 hover:bg-blue-600 text-black px-7 py-2 mt-2' type='submit'>Submit</button>
// //   </div>
// //  </div>
// //  {todo.map((e,index:number)=>(
// //     console.log("id",e._id,filterId),
// //    <div key={index}>
// //     <div className='flex mt-10 justify-around items-center w-full min-h-1/2'>
// //     {e._id ==filterId?
    

// //     <div className='flex gap-2 '>
// //     <input type="text" 
// //     onChange={(e:any)=>setEditText(e.target.value)}
// //      value={EditText}
// //      className='bg-gray-200 h-10 w-3xs rounded-sm text-black border-2'
// //               //  onKeyDown={(e) => e.key === "Enter" && addTodo()}


// //      />
// //      <div className='items-center flex justify-center'>
      
// //       <TiTick onClick={()=>update(e._id as number)} className='font-bold text-lg '/>

// //      </div>
// //      </div>
// // :
// //       <div>
// //         <p className='text-lg font-semibold '>{e.text}</p>
// //       </div>
// //     }
// //       <div>
// // <FaEdit onClick={()=>{setFIlterId(e._id);setEditText(e.text)}}/>
// //       </div>
// //       <div>
// // <FaTrash onClick={()=>{deletedTodos(e._id)}}/>
// //       </div>

// //     </div>
// //   </div>
// //  ))}
// //  <div>

// //  </div>
// //  <div>
// //   <div>
// //     <p></p>
// //   </div>
// //  </div>
// //  <div>
  
// //  </div>



// //  </div>
// //     </div>
// //   )
// // }

// // export default Page
// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { FaEdit } from 'react-icons/fa'
// import { TiTick } from "react-icons/ti";
// import { FaTrash } from 'react-icons/fa';
// import axios from 'axios';
// const Page = () => {
// type Todo={
//   text:string,
//   email?:string
//   isCompleted:boolean
//   _id?:string
  

// }
//   const [text,setText]=useState<string>('')
//   const [todo,setTodo]=useState<Todo[]>([])
//   const [filterId,setFIlterId]=useState<number|string>()
//   const [EditText,setEditText]=useState('')
//   const [isCompleted,setisCompleted]=useState<boolean>(false)
//   const [email,setemail]=useState<string>('muhammadaliadil999@gmail.com')


//   useEffect(()=>{
//     getTodo()
//   },[])

// const getTodo=async()=>{
// const response=await axios.get('/api/todo')
// setTodo(response.data.data)
// }
//   const addTodo=async()=>{
//     const obj:Todo={
//       text:text,
//       isCompleted,
//       email
//     }
//     setTodo([...todo,obj])
//     const response:any=await axios.post('/api/todo',obj)
//     setTodo((pre)=>pre.map((item,i)=>item===obj  ? response.data.data : item))
//     setText('')
//     return response.data.data



//   }
//   const arr=[2,3,4,3,5,3,5,6,4,3]
// //   const duplicateElement=()=>{
// //     let iIndex;
// //     let j:any
// //     for(let i=0 ;i<arr.length;i++){
// //        iIndex=arr[i]
// //        for( j=i+1;j<arr.length;j++){
// //         j=arr[j]
// //        }
// //     }
// //     return {iIndex, j}

// //   }
// // console.log("arr index",duplicateElement())


//   const update=(e:number)=>{
    
// const obj:any={
  
//       text:EditText,
     
//     }

//   setTodo((prev) =>
//     prev.map((item) =>
//     item._id===filterId?
//   {...item,text:EditText}:
//   item
// ));
//   setFIlterId('')

    

//   }

//   const deletedTodos=(id:any)=>{
//     console.log("deletedID",id)
//   const del = todo.filter((e) => e._id !== id)
//     console.log("dele",del)
//   setTodo(del)

//   }
//   console.log("todo",todo)

//   console.log("EditText",EditText)
//   return (
//     <div className='w-full h-screen flex justify-center items-center'>

//  <div className='w-md h-1/2 shadow-sm  '>
//  <div className='flex gap-2 h-7 w-full justify-center items-center'>

//   <div className=' '>
//     <input type="text" 
//     onChange={(e:any)=>setText(e.target.value)}
//      value={text}
//      className='bg-gray-200 h-10 w-3xs rounded-sm text-black border-2'
//               //  onKeyDown={(e) => e.key === "Enter" && addTodo()}


//      />
//   </div>
//   <div>
//     <button onClick={()=>addTodo()} className='bg-blue-500 mb-2 hover:bg-blue-600 text-black px-7 py-2 mt-2' type='submit'>Submit</button>
//   </div>
//  </div>
//  {todo.map((e,index:number)=>(
//     console.log("id",e._id,filterId),
//    <div key={index}>
//     <div className='flex mt-10 justify-around items-center w-full min-h-1/2'>
//     {e._id ==filterId?
    

//     <div className='flex gap-2 '>
//     <input type="text" 
//     onChange={(e:any)=>setEditText(e.target.value)}
//      value={EditText}
//      className='bg-gray-200 h-10 w-3xs rounded-sm text-black border-2'
//               //  onKeyDown={(e) => e.key === "Enter" && addTodo()}


//      />
//      <div className='items-center flex justify-center'>
      
//       <TiTick onClick={()=>update(e._id as any)} className='font-bold text-lg '/>

//      </div>
//      </div>
// :
//       <div>
//         <p className='text-lg font-semibold '>{e.text}</p>
//       </div>
//     }
//       <div>
// <FaEdit onClick={()=>{setFIlterId(e._id);setEditText(e.text)}}/>
//       </div>
//       <div>
// <FaTrash onClick={()=>{deletedTodos(e._id)}}/>
//       </div>

//     </div>
//   </div>
//  ))}
//  <div>

//  </div>
//  <div>
//   <div>
//     <p></p>
//   </div>
//  </div>
//  <div>
  
//  </div>



//  </div>
//     </div>
//   )
// }

// export default Page
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page