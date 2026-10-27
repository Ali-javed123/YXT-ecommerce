"use client"
import React,{useState} from 'react'
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ShowHideColumnsMenu,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IconButton, Tooltip } from '@mui/material';
import { RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';
import RecyclingIcon from '@mui/icons-material/Recycling';

import DeleteIcon from '@mui/icons-material/Delete';
import ButtonLoading from '../../components/Application/Button'
 
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { mkConfig, generateCsv, download, CsvOutput } from 'export-to-csv'; //or use your library of choice here

const Datatable = ({
    queryKey,
    fetchUrl,
    columnConfig,
    initialSize=10,
    exportEndpoint,
    deleteEndpoint,
    deleteType, //SD(Soft Delete) PD(Permenant Delete) RST(Restore data),
    trashView,
    createAction
}:any) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [exportLoading,setExportLoading]=useState(false)
const [selectedRow, setRowSelected] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
    const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<any>({
    queryKey:[queryKey,{columnFilters,pagination,sorting,globalFilter}],
    queryFn:async()=>{
        const url=new URL(fetchUrl,process.env.NEXT_PUBLIC_BASE_URL)

        url.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      url.searchParams.set('deleteType', deleteType);
      const {data:response}=await axios.get(url.href)
      return response


    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page

  })
  console.log("meta",meta)
console.log("deleteType",deleteType)

  // const deleteMutation=useDeleteMutation(queryKey,deleteType)
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);
const handleDelete = (
  ids: string[],
  deleteType: any
) => {
  let ans;
  if (deleteType === "PD") {
     ans = confirm(
      "Are you sure you want to permanently delete all data?"
    );

    // if (!yesNO) return;
  }else{
     ans = confirm(
      "Are you sure you want to move in trash?"
    )
  }

  deleteMutation.mutate({
    ids: ids,
    deleteType,
  });
  setRowSelected({})

};

  const table=useMaterialReactTable({
    columns:columnConfig,
    data,

    enableRowSelection:true,
    columnFilterDisplayMode:'popover',
    paginationDisplayMode:"pages",
    enableColumnOrdering:true,
    enableStickyHeader:true,
    enableStickyFooter:true,
    initialState:{showColumnFilters:true},
    manualFiltering:true,
    manualPagination:true,
    manualSorting:true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
          onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange:setRowSelected,
        state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection:selectedRow
    },
    getRowId:(orignalRow)=>orignalRow._id,
          renderToolbarInternalActions: ({ table }) => (
    <>
      
      {/* built-in buttons (must pass in table prop for them to work!) */}
      <MRT_ToggleGlobalFilterButton table={table} />
      <MRT_ShowHideColumnsButton table={table} />
      <MRT_ToggleFullScreenButton table={table}/>
        <MRT_ToggleDensePaddingButton table={table} />
{deleteType!=="PD"&&
<Tooltip title="Recycle Bin">

  <Link href={trashView}>
  <IconButton>
    <RecyclingIcon />
  </IconButton>
  </Link>
</Tooltip>
}
{deleteType==="SD"&&
<>

<Tooltip title="Delete All">
  <IconButton
  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
    onClick={()=>  handleDelete(Object.keys(selectedRow ?? {}), deleteType)
}

  >
    <DeleteIcon/>
  </IconButton>
</Tooltip>


</>
}
{deleteType==="PD"&&
<>
<Tooltip title="Restore Data">

  <IconButton 
  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
    onClick={()=>handleDelete(Object.keys(selectedRow),"RSD")}

  >
    <RestoreFromTrashIcon/>
  </IconButton>
</Tooltip>

<Tooltip title="Delete Permenantly">

  <IconButton 
  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
  onClick={()=>handleDelete(Object.keys(selectedRow),"PD")}

  >
    <DeleteForeverIcon/>
  </IconButton>
</Tooltip>
</>
}

    </>
  ),
    enableRowActions: true,
    positionActionsColumn:"last",
renderRowActionMenuItems: ({ row }) =>
  createAction(row, deleteType, handleDelete),
    renderTopToolbarCustomActions: ({table})=>(

        <Tooltip title="Export">
          <ButtonLoading
           type="button"
  
           text={<><FileDownloadIcon className='!text-[18px]'/>Export</>}
           loading={exportLoading}
           onClick={()=>handleExport(table.getSelectedRowModel().rows)}
           className="cursor-pointer"
           />
        </Tooltip>
    )




  })



  const handleExport=async(selectedRows:any)=>{
    setExportLoading(true)
    try {
          const csvConfig = mkConfig({
            fieldSeparator:',',
            decimalSeparator:".",
            useKeysAsHeaders:true,
            filename:"csv-data"
          })
          let csv;
          if(Object.keys(selectedRow).length>0){
            const rowData=selectedRows.map((row:any)=>row.orignal)
            csv=generateCsv(csvConfig)(rowData)
          }else{
            const{data:response}=await axios.get(exportEndpoint)
            if(!response.success){
              throw new Error(response.massege)
            }
            const responseData=response.data
            csv=generateCsv(csvConfig)(responseData)


          }
          download(csvConfig)(csv)


    } catch (error) {
      console.log("Datatable error",error)
      setExportLoading(!exportLoading)
    }

  }

  return (
    <div><MaterialReactTable  table={table}/></div>
  )
}

export default Datatable