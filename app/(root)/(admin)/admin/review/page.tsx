"use client";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {    ADMIN_DASHBOARD,  ADMIN_TRASH,ADMIN_COUPON, } from "@/routes/AdminPanel.route";
import { CardHeader,Card, CardContent } from "@/components/ui/card";
import DatatableWrapper from "@/components/Application/DatatableWrapper";
import { columnConfig } from "@/lib/helperFunctions";
import type { MRT_Row } from "material-react-table";
import DeleteAction from "@/components/Application/DeleteAction";
import { DT_CUSTOMERS_COLUMN, DT_REVIEWS_COLUMN } from "@/lib/column";
export type DeleteType = "SD" | "PD" | "RSD";
const ShowReviews = () => {

  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_COUPON, label: "Reviews" },
  ];

const column=useMemo(()=>{
return columnConfig(DT_REVIEWS_COLUMN)
},[])
interface DataType {
  _id: string;
  [key: string]: unknown;
}


const action = <TData extends DataType,>(
  row: MRT_Row<TData>,
  deleteType: DeleteType,
  handleDelete: (
    ids: string[],
    type: DeleteType
  ) => void
) => [
  
  <DeleteAction
    key="delete"
    handleDelete={handleDelete}
    row={row}
    deleteType={deleteType}
  />,
];

 return (
  <div className="w-full " >
    <Breadcrum data={breadcrum} />

    {/* ✅ Yeh force karega left alignment */}
    <div className="mt-5  w-full flex justify-start items-start">
      <Card className="py-0 gap-0 w-full">      {/* w-md wapas lagayen */}
        <CardHeader className="py-2 px-2 border-b [.border-b]:pb-3">
          <div className="flex justify-between items-center">

            <h2 className="text-xl font-bold">Show Review</h2>

          
            </div>
        </CardHeader>

        <CardContent className="px-0">
          <div>
            <DatatableWrapper
            queryKey="reviews-data"
            fetchUrl='/api/reviews'
            initialSize={10}
            columnConfig={column}
            exportEndpoint="/api/reviews/export"
            deleteEndpoint="/api/reviews/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=reviews`}
            createAction={action}
            >

            </DatatableWrapper>

          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
};

export default ShowReviews;