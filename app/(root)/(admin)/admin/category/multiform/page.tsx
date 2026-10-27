'use client'
import React from 'react'
import { useState } from 'react'
import {Formik,Form,FastField,ErrorMessage} from 'formik'
import z, { string } from 'zod'
import { Label } from '@/components/ui/label'

const page = () => {

    const OneSchema=z.object({
        fname:z.string().min(1,"fname is required!"),
        lname:z.string().min(1,"lname is required!"),
    })
    const TwoSchema=z.object({
        email:z.email().min(1,"email is required!"),
        password:z.string().min(1,"password is required!"),
    })
    const ThreeSchema=z.object({
        city:z.string().min(1,"city is required!"),
        description:z.string().min(1,"description is required!"),
    })
    const initialValues={
        fname:'',
        lname:'',
        email:'',
        password:'',
        city:'',
        description:''
    }

    const [step,setStep]=useState<number>(0)
    const fullSchema=[OneSchema,TwoSchema,ThreeSchema]
    const isLast=step==fullSchema.length-1
    const isError=(value:any)=>{
        const error=fullSchema[step].safeParse(value) 
        const errors:Record<string,string>={}
        console.log("error",error)
        if(error.error){

            for(let issue of error?.error?.issues ) {
                const key=String(issue.path[0])
                console.log("issues",issue)
                console.log("path",key)
               if(!errors[key]){

                   errors[key]=issue.message
               }
                // errors[]
    
    
    
            }
        }
        console.log("errors",errors)
        return errors

    }
    console.log("step",step)
  return (
    <div>
        <Formik
        initialValues={initialValues}
        validate={isError as any}
        onSubmit={(e:any,helper)=>{
            console.log("values",e)
            if(!isLast){
          setStep(step + 1);

                helper.setTouched({})
            }

                helper.setSubmitting(false)
        
            if(isLast){
          setStep(0);

            }

        }}
        

        >
            <Form>
                {step===0&&
                <div className="my-2 flex gap-2 items-center justify-center">
                <div >

                    <Label htmlFor='fname'>First Name</Label>
                    <FastField name="fname" placeholder="Enter your Last name" className="w-full rounded border p-2"/>
                    <ErrorMessage name='fname' className="text-red-500 "/>
                </div>
                <div className="my-2">

                    <Label htmlFor='lname'>Last Name</Label>
                    <FastField name="lname" placeholder="Enter your Last name" className="w-full rounded border p-2"/>
                    <ErrorMessage name='lname' className="text-red-500 "/>

                </div>
                </div>

                }
                {step===1&&
                <div className="my-2 flex gap-2 items-center justify-center">
                <div className="my-2">

                    <Label htmlFor='email'>Email</Label>
                    <FastField placeholder="email" name='email' className="w-full rounded border p-2"/>
                    <ErrorMessage name='email' className="text-red-500 "/>

                </div>
                <div >

                    <Label htmlFor='password'>Password</Label>
                    <FastField  name="password" className="w-full rounded border p-2"/>
                    <ErrorMessage name='password' className="text-red-500 "/>

                </div>
                </div>

                }
                {step===2&&
                <div className="my-2 flex gap-2 items-center justify-center">
                <div className="my-2">

                    <Label htmlFor='city' >City</Label>
                    <FastField name="city" className="w-full rounded border p-2"/>
                    <ErrorMessage name='city' className="text-red-500 "/>

                </div>
                <div className="my-2">

                    <Label htmlFor='description' >Description</Label>
                    <FastField  name="description" className="w-full rounded border p-2"/>
                    <ErrorMessage name='city' className="text-red-500 "/>

                </div>
                </div>

                }
                <div className='flex justify-center items-center'>
                                {step > 0 && (

                    <div>
                        <button onClick={()=>setStep((e)=>e-1)} className='py-2 px-7 bg-blue-500 shadow-md shadow-gray-400'>Back</button>
                    </div>
                                )}
                                <div>

                        <button type='submit' className='py-2 px-7 bg-blue-500 shadow-md shadow-gray-400'>Submit</button>
                                </div>
     <div>
                    </div>
                </div>
            </Form>
        </Formik>



    </div>
  )
}

export default page