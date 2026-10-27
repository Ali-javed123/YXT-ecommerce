"use client";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrum from "@/components/Application/Breadcrum";
import { ADMIN_CATERGORY, ADMIN_CATERGORY_ADD, ADMIN_CATERGORY_EDIT, ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanel.route";
import { CardHeader,Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Datatable from "@/components/Application/Datatable";
import DatatableWrapper from "@/components/Application/DatatableWrapper";
import { columnConfig } from "@/lib/helperFunctions";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import type { MRT_Row } from "material-react-table";
import EditAction from "@/components/Application/EditAction";
import DeleteAction from "@/components/Application/DeleteAction";
import { useSearchParams } from "next/navigation";
import { configureStore } from "@reduxjs/toolkit";
export type DeleteType = "SD" | "PD" | "RSD";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

type trashOf=keyof typeof TrashConfig;

 const TrashConfig={
    category:{
      title:"Category Trash",
      columns:DT_CATEGORY_COLUMN,
      fetchUrl:'/api/category',
      exportUrl:'/api/category/export',
      deleteUrl:'/api/category/delete'
    }
  }

const Page = ({params}:PageProps) => {
  const searchParams=useSearchParams()
  const trashOf=searchParams.get("trashof")

  const breadcrum = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_TRASH, label: "Trash" },
  ];


     const config = trashOf
    ? TrashConfig[trashOf as keyof typeof TrashConfig]
    : undefined;

const column=useMemo(()=>{
return columnConfig(config?.columns ?? DT_CATEGORY_COLUMN,false,false,true)
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

            <h2 className="text-xl font-bold">Trash Category</h2>

          <Link 
          href={ADMIN_CATERGORY_ADD}
            className={buttonVariants()}

          
          >
            
          <FaPlus/>
            
            New Category
            </Link>
            </div>
        </CardHeader>

        <CardContent className="px-0">
          <div>
            <DatatableWrapper
            queryKey={`${trashOf}-data-delete`}
            fetchUrl={`${config?.fetchUrl}`}
            initialSize={10}
            columnConfig={column}
            exportEndpoint={`${config?.exportUrl}`}
            deleteEndpoint={`${config?.deleteUrl}`}
            deleteType="PD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
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

export default Page;