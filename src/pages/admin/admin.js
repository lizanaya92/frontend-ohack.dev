import React from "react";


import { EditNonProfit } from "./nonprofit-edit";
import { AddNonProfit } from "./nonprofit-add";


import { useAdmin } from '../../hooks/use-admin-check'


export const Admin = ({ admin }) => {    
    const { isAdmin } = useAdmin();
    if (!isAdmin)
    {
        return(<span></span>);
    } 

    return(
        <div>
        <AddNonProfit></AddNonProfit>

        <EditNonProfit></EditNonProfit>
        </div>
        );
};