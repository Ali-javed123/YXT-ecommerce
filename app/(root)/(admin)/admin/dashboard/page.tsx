import React from 'react'
import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OrderOverview } from './OrderOverview'
import { OrderStatus } from './OrderStatus'
const AdminDashboard = () => {
  return (
    <div className='pt-5'>
      <CountOverview/>
      <QuickAdd/>
      <div className='mt-6 flex  lg:flex-nowrap gap-2'>
        <Card className='md:w-[70%] w-full '>
          <CardHeader>
            <div className='py-3 flex justify-between items-center'>
              <span className='text-md font-bold'>Order Overview</span>
              <Button type="button">
                <Link href="">View All</Link>
              </Button>
            </div>


          </CardHeader>
                    <CardContent>
            <OrderOverview/>

          </CardContent>


        </Card>
        <Card className='md:w-[30%] w-full '>
          <CardHeader>
            <div className='py-3 flex justify-between items-center'>
              <span className=' text-md font-bold'>Order Status </span>
              <Button type="button">
                <Link href="">View All</Link>
              </Button>
            </div>


          </CardHeader>
          <CardContent>
            <OrderStatus/>
          </CardContent>

        </Card>

      </div>


    </div>
  )
}

export default AdminDashboard