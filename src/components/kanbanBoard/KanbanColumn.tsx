import React, { useRef, useState } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";
import { KanbanCard } from "./KanbanCard";
import {
  handleColDelete,
  handleDragLeaveColumn,
  handleDragOverColumn,
  handleDropColumn,
} from "../../utils/column.utils";
import { Button } from "../primitives/Button";

interface Props {
  column: KanbanColumn;
  tasks: KanbanTask[];
  handleTaskMove: (
    taskId: string,
    from: string,
    to: string,
    newIndex: number,
  ) => void;
  dragState: {
    draggedTaskId: string | null;
    sourceColumnId: string | null;
    targetColumnId: string | null;
    targetIndex: number | null;
    isKeyboardDragging: boolean;
    focusedTaskId: string | null;
    handleDragStart: (id: string, columnId: string) => void;
    handleDragOver: (columnId: string, index: number | null) => void;
    handleDragEnd: () => void;
    handleKeyboardPickUp: (taskId: string, columnId: string) => void;
    handleKeyboardMove: (
      direction: "up" | "down" | "left" | "right",
      columns: KanbanColumn[],
      tasks: Record<string, KanbanTask>,
    ) => void;
    handleKeyboardDrop: () => void;
  };
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddNewOrEdit: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<string | null>>;
  setColumnId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowColModal: React.Dispatch<
    React.SetStateAction<"rename" | "wiplimit" | null>
  >;
  setColToEdit: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KanbanColumnComponent = ({
  column,
  tasks,
  handleTaskMove,
  dragState,
  setShowAddModal,
  setAddNewOrEdit,
  setTaskToEdit,
  setColumnId,
  setShowColModal,
  setColToEdit,
}: Props) => {
  const {
    draggedTaskId,
    sourceColumnId,
    targetIndex,
    targetColumnId,
    isKeyboardDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleKeyboardPickUp,
    handleKeyboardDrop,
    focusedTaskId,
  } = dragState;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const draggedTaskIndex = useRef<number | null>(null);
  const [isOverColumn, setIsOverColumn] = useState(false);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [isExpand, setIsExpand] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  function handleEdit(taskId: string) {
    setColumnId(column.id);
    setShowAddModal(true);
    setAddNewOrEdit("edit");
    setTaskToEdit(taskId);
  }

  // Get the current index of the dragged task in this column
  const currentDraggedTaskIndex = draggedTaskId
    ? tasks.findIndex((t) => t.id === draggedTaskId)
    : -1;
  return (
    <div
      onDragOver={(e) =>
        handleDragOverColumn({
          e,
          setIsOverColumn,
          setHoverIndex,
          setDragDirection,
          handleDragOver,
          columnId: column.id,
          draggedTaskIndex,
          tasksLength: tasks.length,
        })
      }
      onDragLeave={(e) =>
        handleDragLeaveColumn({
          e,
          setIsOverColumn,
          setHoverIndex,
          setDragDirection,
          handleDragOver,
          columnId: column.id,
          tasksLength: tasks.length,
        })
      }
      onDrop={() =>
        handleDropColumn({
          setHoverIndex,
          setIsOverColumn,
          setDragDirection,
          draggedTaskId,
          sourceColumnId,
          targetIndex,
          handleTaskMove,
          columnId: column.id,
          tasksLength: tasks.length,
        })
      }
      className={`bg-gray-300 ${(isOverColumn || (isKeyboardDragging && targetColumnId === column.id)) && "border border-blue-500"} scroll-thin rounded-xl p-3 flex flex-col w-full max-h-[500px] sm:w-full md:w-[280px] lg:max-h-[823px] lg:w-[320px] h-fit`}
    >
      <header
        onClick={() => setIsExpand((prev) => !prev)}
        className="flex justify-between items-center mb-3 sticky top-0 bg-gray-300"
      >
        <h3 className="font-semibold">{column.title}</h3>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="p-1 rounded hover:bg-gray-200"
          >
            ⋯
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md border z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setColToEdit(column.id);
                  setShowColModal("rename");
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Rename Column
              </button>
              <button
                onClick={() => setIsExpand((prev) => !prev)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                {!isExpand ? "Expand Column" : "Collapse Column"}
              </button>
              <button
                onClick={() => {
                  setColToEdit(column.id);
                  setShowColModal("wiplimit");
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Set WIP Limit
              </button>
              <button
                onClick={() => handleColDelete(column.id)}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete Column
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-col overflow-y-auto scrollbar-thin">
        {(hoverIndex === 0 ||
          (isKeyboardDragging &&
            targetColumnId === column.id &&
            targetIndex === 0)) &&
          draggedTaskId && (
            <div className="w-full h-2 bg-blue-300 rounded mt-2"></div>
          )}

        {!isExpand || showMenu ? (
          <div></div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-black italic py-6 text-center">
            No tasks
          </div>
        ) : (
          tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <div className="task-wrapper w-full">
                {targetIndex !== tasks.length &&
                  ((hoverIndex === index &&
                    draggedTaskId &&
                    dragDirection === "up") ||
                    (isKeyboardDragging &&
                      targetColumnId === sourceColumnId &&
                      targetColumnId === column.id &&
                      targetIndex === index &&
                      draggedTaskId &&
                      currentDraggedTaskIndex > index) ||
                    (isKeyboardDragging &&
                      targetColumnId === column.id &&
                      targetColumnId !== sourceColumnId &&
                      targetIndex === index - 1 &&
                      draggedTaskId &&
                      currentDraggedTaskIndex > index - 1)) && (
                    <div className="w-full h-2 bg-blue-300 rounded mt-2"></div>
                  )}
                <KanbanCard
                  task={task}
                  handleDragStart={(id) => {
                    draggedTaskIndex.current = index;
                    handleDragStart(id, column.id);
                  }}
                  handleDragEnd={handleDragEnd}
                  columnId={column.id}
                  handleKeyboardPickUp={handleKeyboardPickUp}
                  handleKeyboardDrop={handleKeyboardDrop}
                  isKeyboardDragging={isKeyboardDragging}
                  focusedTaskId={focusedTaskId}
                  handleEdit={handleEdit}
                />
                {targetIndex !== tasks.length &&
                  ((hoverIndex === index &&
                    draggedTaskId &&
                    dragDirection === "down") ||
                    (isKeyboardDragging &&
                      targetColumnId === sourceColumnId &&
                      targetColumnId === column.id &&
                      targetIndex === index &&
                      draggedTaskId &&
                      currentDraggedTaskIndex < index) ||
                    (isKeyboardDragging &&
                      targetColumnId === column.id &&
                      targetColumnId !== sourceColumnId &&
                      targetIndex === index + 1 &&
                      draggedTaskId &&
                      currentDraggedTaskIndex < index + 1)) && (
                    <div className="w-full h-2 bg-blue-300 rounded mt-2"></div>
                  )}
              </div>
            </React.Fragment>
          ))
        )}
        {(hoverIndex === tasks.length ||
          (isKeyboardDragging &&
            targetColumnId === column.id &&
            targetIndex === tasks.length)) &&
          draggedTaskId && (
            <div className="w-full h-2 bg-blue-300 rounded mt-2"></div>
          )}
      </div>
      <Button
        onClick={() => {
          setColumnId(column.id);
          setAddNewOrEdit("add");
          setShowAddModal(true);
        }}
        variant="ghost"
        className="w-full mt-3 text-xs sm:text-sm border border-gray-200 hover:border-gray-300"
        ariaLabel={`Add task to ${column.title} column`}
      >
        + Add Task
      </Button>
    </div>
  );
};
