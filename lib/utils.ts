import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface size{
  label:string;
  value:string
}
export const size:size[]= [
  {value:'sm',label:"sm"},
  {value:'md',label:"md"},
  {value:'lg',label:"lg"},
  {value:'xl',label:"xl"},
  {value:'2xl',label:"2xl"}
]