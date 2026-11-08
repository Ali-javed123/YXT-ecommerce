"use client";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import {  ADMIN_PRODUCT_ADD,  ADMIN_DASHBOARD, ADMIN_PRODUCT, ADMIN_TRASH, ADMIN_PRODUCT_EDIT } from "@/routes/AdminPanel.route";
import { CardHeader,Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Datatable from "@/components/Application/Datatable";
import DatatableWrapper from "@/components/Application/DatatableWrapper";
import { columnConfig } from "@/lib/helperFunctions";
import { DT_CATEGORY_COLUMN, DT_PRODUCT_COLUMN } from "@/lib/column";
import type { MRT_Row } from "material-react-table";
import EditAction from "@/components/Application/EditAction";
import DeleteAction from "@/components/Application/DeleteAction";
export type DeleteType = "SD" | "PD" | "RSD";
const ShowProducts = () => {

  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_PRODUCT, label: "Product" },
  ];

const column=useMemo(()=>{
return columnConfig(DT_PRODUCT_COLUMN)
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
  <EditAction
    key="edit"
href={ADMIN_PRODUCT_EDIT(row.original._id)}
  />,
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

            <h2 className="text-xl font-bold">Show Product</h2>

          <Link 
          href={ADMIN_PRODUCT_ADD}
            className={buttonVariants()}

          
          >
            
          <FaPlus/>
            
            New Products
            </Link>
            </div>
        </CardHeader>

        <CardContent className="px-0">
          <div>
            <DatatableWrapper
            queryKey="product-data"
            fetchUrl='/api/product'
            initialSize={10}
            columnConfig={column}
            exportEndpoint="/api/product/export"
            deleteEndpoint="/api/product/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=product`}
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

export default ShowProducts;