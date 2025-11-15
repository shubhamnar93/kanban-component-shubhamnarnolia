import React, { useRef, useState } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";
import { KanbanCard } from "./KanbanCard";
import {
  handleDragLeaveColumn,
  handleDragOverColumn,
  handleDropColumn,
} from "../../utils/column.utils";

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
}

export const KanbanColumnComponent: React.FC<Props> = ({
  column,
  tasks,
  handleTaskMove,
  dragState,
}) => {
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
    handleKeyboardMove,
    handleKeyboardDrop,
    focusedTaskId,
  } = dragState;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const draggedTaskIndex = useRef<number | null>(null);
  const [isOverColumn, setIsOverColumn] = useState(false);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(
    null,
  );

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
      <header className="flex justify-between items-center mb-3 sticky top-0 bg-gray-300">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-neutral-500">{tasks.length}</span>
      </header>
      <div className="flex flex-col overflow-y-auto scrollbar-thin">
        {(hoverIndex === 0 ||
          (isKeyboardDragging &&
            targetColumnId === column.id &&
            targetIndex === 0)) &&
          draggedTaskId && (
            <div className="w-full h-2 bg-blue-300 rounded mt-2"></div>
          )}
        {tasks.length === 0 ? (
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
                  onDragOver={() => {}}
                  columnId={column.id}
                  handleKeyboardPickUp={handleKeyboardPickUp}
                  handleKeyboardMove={handleKeyboardMove}
                  handleKeyboardDrop={handleKeyboardDrop}
                  isKeyboardDragging={isKeyboardDragging}
                  focusedTaskId={focusedTaskId}
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
    </div>
  );
};
