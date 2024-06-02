import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";
import styled from "styled-components";
import { helper } from "@/utils/helper";
import { Link } from "react-router-dom";
const DraggingRow = styled.td`
  background: rgba(127, 207, 250, 0.3);
`;
import { Lucide } from "@/base-components";
const TableData = styled.td`
  background: white;
  &:first-of-type {
    min-width: 20px;
  }
`;

export const DraggableTableRow = ({
  setUserId,
  setDeleteConfirmationModal,
  setAdminConfirmationModal,
  viewAsEmployee,
  row,
  setRole,
}) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: row.original.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  return (
    <tr ref={setNodeRef} style={style} {...row.getRowProps()}>
      {isDragging ? (
        <DraggingRow colSpan={row.cells.length}>&nbsp;</DraggingRow>
      ) : (
        row.cells.map((cell, i) => {
          if (i === 0) {
            return (
              <TableData {...cell.getCellProps()}>
                <DragHandle {...attributes} {...listeners} />
                <span>{cell.render("Cell")}</span>
              </TableData>
            );
          }

          if (i === 4) {
            return (
              <TableData {...cell.getCellProps()}>
                <span>{cell.value == 1 ? "IR" : "TR"}</span>
              </TableData>
            );
          }

          if (i === 5) {
            return (
              <TableData {...cell.getCellProps()}>
               
                <div className="flex justify-center items-center">
                  <Link
                    className="flex items-center text-info mr-3"
                    to={"/profile/" + row.original.id}
                  >
                    <Lucide icon="Eye" className="w-4 h-4 mr-1 " /> View Users
                  </Link>

                  <Link
                    className="flex items-center text-warning mr-3"
                    to={"/emp_activity/" + row.original.id}
                  >
                    <Lucide icon="Activity" className="w-4 h-4 mr-1 " />
                    Activity
                  </Link>
                  <button
                    className="flex items-center text-success mr-3"
                    onClick={() => viewAsEmployee(row.original.id)}
                  >
                    <Lucide icon="EyeOff" className="w-4 h-4 mr-1 " />
                    View as Employee
                  </button>

                  <a
                    className="flex items-center text-danger"
                    href="#"
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                      setUserId(row.cells[0].value);
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </a>

                  <a
                    className="flex items-center text-purple"
                    href="#"
                    onClick={() => {
                      setAdminConfirmationModal(true);
                      setUserId(row.cells[0].value);
                      setRole(2);
                    }}
                  >
                    <Lucide icon="UserPlus" className="w-4 h-4 mr-1 ml-1" />{" "}
                    Promoted To Admin
                  </a>
                  <a
                    className="flex items-center text-"
                    href="#"
                    onClick={() => {
                      setAdminConfirmationModal(true);
                      setUserId(row.cells[0].value);
                      setRole(4);
                    }}
                  >
                    <Lucide icon="UserPlus" className="w-4 h-4 mr-1 ml-1" />{" "}
                    Promoted To Supervisor
                  </a>
                </div>
              </TableData>
            );
          }

          return (
            <TableData {...cell.getCellProps()}>
              {cell.render("Cell")}
            </TableData>
          );
        })
      )}
    </tr>
  );
};
