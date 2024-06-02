import React, { useMemo, useState } from "react";
import axios from "axios";
import { adminApi } from "../../../configuration";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTable } from "react-table";
import { DraggableTableRow } from "./DraggableTableRow";
import { StaticTableRow } from "./StaticTableRow";

export function Table({
  setUserId,
  setDeleteConfirmationModal,
  setAdminConfirmationModal,
  viewAsEmployee,
  columns,
  data,
  setData,
  headers,
  setRole
}) {
  const [activeId, setActiveId] = useState();
  const items = useMemo(() => data?.map(({ id }) => id), [data]);
  // Use the state and functions returned from useTable to build your UI

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const update_sort = async (ids) => {
    const URL = adminApi() + "users_sort";

    try {
      const response = await axios.post(
        URL,
        { sort: ids },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        //  setCallState(response?.data?.data);
      }
    } catch (err) {
     // console.log(err);
    }
  };



  //// // // /// // // // /// // ///// / / / // / // / / //



  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      var dat = arrayMove(data, oldIndex, newIndex);
      setData(dat);

      var imp = [];

      dat.map((da, ind) => {
        imp.push(da.id);
      });

      //console.log(imp);

      update_sort(imp);
    }

    setActiveId(null);

    // console.log("active.id", active.id);
    // console.log("over.id", over.id);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const selectedRow = useMemo(() => {
    if (!activeId) {
      return null;
    }
    const row = rows.find(({ original }) => original.id === activeId);
    prepareRow(row);
    return row;
  }, [activeId, rows, prepareRow]);

  // Render the UI for your table
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <table className="table  table-report" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <DraggableTableRow
                  setAdminConfirmationModal={setAdminConfirmationModal}
                  setDeleteConfirmationModal={setDeleteConfirmationModal}
                  setUserId={setUserId}
                  viewAsEmployee={viewAsEmployee}
                  key={row.original.id}
                  row={row}
                  setRole={setRole}
                />
              );
            })}
          </SortableContext>
        </tbody>
      </table>
      <DragOverlay>
        {activeId && (
          <table style={{ width: "100%" }}>
            <tbody>
              <StaticTableRow row={selectedRow} />
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
}
