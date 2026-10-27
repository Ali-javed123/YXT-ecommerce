"use client"
import { ThemeProvider } from "@mui/material"
import Datatable from "./Datatable"
import { useTheme } from "next-themes"
import { useEffect, useEffectEvent, useState } from "react"
import { darkTheme,lightTheme } from "@/lib/materialTheme"

const DatatableWrapper = ({
    queryKey,
    fetchUrl,
    columnConfig,
    initialSize=10,
    exportEndpoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createAction
}:any) => {
  const {resolvedTheme}=useTheme()
  const [mounted,setMounted]=useState(false)
  useEffect(()=>{
setMounted(true)
  },[])
  if (!mounted) return null

  console.log("Hy",fetchUrl)
  return (
    <ThemeProvider theme={resolvedTheme=="dark"?darkTheme:lightTheme}>
      <Datatable
      
      queryKey={queryKey}
    fetchUrl={fetchUrl}
    columnConfig={columnConfig}
    initialSize={initialSize}
    exportEndpoint={exportEndpoint}
    deleteEndpoint={deleteEndpoint}
    deleteType={deleteType}
    trashView={trashView}
  createAction={createAction}   // ✅

      />
    </ThemeProvider>
  )
}

export default DatatableWrapper