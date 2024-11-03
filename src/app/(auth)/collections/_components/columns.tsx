"use client";
import { type RouterOutput } from "@/server/api/root";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import EditCollection from "./edit-collection";
import { useState } from "react";
import DeleteCollection from "./delete-collection";
import Link from "next/link";
export const columns: ColumnDef<RouterOutput["collection"]["mine"][number]>[] =
  [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),

      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last updated at" />
      ),
      cell: ({ row }) => format(row.getValue("updatedAt"), "PPPp"),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showEdit, setShowEdit] = useState(false);
        const [showDelete, setShowDelete] = useState(false);
        const collectionId = row.original.id;
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/collections/${collectionId}/new-question`}>
                    Add New Question
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="w-full cursor-pointer"
                    type="button"
                  >
                    Edit
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-red-100 focus:text-red-900"
                >
                  <button
                    onClick={() => setShowDelete(true)}
                    className="w-full"
                    type="button"
                  >
                    Delete
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {showEdit && (
              <EditCollection
                setOpen={setShowEdit}
                open={showEdit}
                collectionId={collectionId}
              />
            )}
            {showDelete && (
              <DeleteCollection
                setOpen={setShowDelete}
                open={showDelete}
                collectionId={collectionId}
              />
            )}
          </>
        );
      },
    },
  ];
