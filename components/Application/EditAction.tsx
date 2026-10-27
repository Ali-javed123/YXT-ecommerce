
"use client";

import { ListItemIcon, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

const EditAction = ({ href }: { href: string }) => {
  return (
    <MenuItem component={Link} href={href}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      Edit
    </MenuItem>
  );
};

export default EditAction;
