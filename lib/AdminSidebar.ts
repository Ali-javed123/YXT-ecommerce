import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_CATERGORY, ADMIN_CATERGORY_ADD, ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanel.route";


export const adminAppSidebarMenu=[

    {
    title:"Dashboard",
    url:ADMIN_DASHBOARD,
    icons:AiOutlineDashboard
    },
     {
    title:"Category",
    url:ADMIN_CATERGORY_ADD,
    icons:BiCategory,
    submenu:[
{
    title:"Add Category",
    url:ADMIN_CATERGORY_ADD,
},
{
    title:"All Category",
    url:ADMIN_CATERGORY,
}
    ]

    },
     {
    title:"Product",
    url:"#",
    icons:IoShirtOutline,
    submenu:[
{
    title:"Add Products",
    url:"#",
},
{
    title:"Add Varients",
    url:"#",
},
{
    title:"Products Varients",
    url:"#",
},
{
    title:"All Products",
    url:"#",
}

    ]

    },
    {
    title:"Coupons",
    url:"#",
    icons:RiCoupon2Line,
    submenu:[
{
    title:"Add Coupons",
    url:"#",
},
{
    title:"All Coupons",
    url:"#",
},


    ]

    },
    {
    title:"Orders",
    url:"#",
    icons:MdOutlineShoppingBag,
    

    },
    {
    title:"Customers",
    url:"#",
    icons:LuUserRound,
    

    },
    {
    title:"Rating & Review",
    url:"#",
    icons:IoMdStarOutline,
    

    },
    {
    title:"Media",
    url:ADMIN_MEDIA_SHOW,
    icons:MdOutlinePermMedia,
    

    }
    
    
]
