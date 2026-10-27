
"use client";

import { ListItemIcon, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { MRT_Row } from "material-react-table";

export interface DataType {
  _id: string;
  [key: string]: unknown;
}

type DeleteType = "SD" | "PD" | "RSD";

interface DeleteActionProps<TData extends DataType> {
  handleDelete: (
    ids: string[],
    deleteType: DeleteType
  ) => void;
  row: MRT_Row<TData>;
  deleteType: DeleteType;
}

const DeleteAction = <TData extends DataType,>({
  handleDelete,
  row,
  deleteType,
}: DeleteActionProps<TData>) => {
  return (
    <MenuItem
      onClick={() =>
        handleDelete([row.original._id], deleteType)
      }
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

export default DeleteAction;
