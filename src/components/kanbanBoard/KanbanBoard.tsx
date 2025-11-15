import { useState } from "react";
import "../../styles/globals.css";
import type { KanbanBoardProps } from "./KanbanBoard.types";
import { KanbanColumnComponent } from "./KanbanColumn";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { handleTaskMove } from "../../utils/task.utils";

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns: initialColumns,
  tasks: initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const dragState = useDragAndDrop();

  const handleKeyboardMove = (direction: "up" | "down" | "left" | "right") => {
    dragState.handleKeyboardMove(direction, columns, tasks);
  };

  const handleKeyboardDrop = () => {
    if (dragState.draggedTaskId && dragState.sourceColumnId && dragState.targetColumnId !== null) {
      handleTaskMove(dragState.draggedTaskId, dragState.sourceColumnId, dragState.targetColumnId, dragState.targetIndex || 0, columns, setColumns, tasks, setTasks, onTaskMove, dragState);
    }
    dragState.handleKeyboardDrop();
  };

  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }

  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    if (dragState.isKeyboardDragging && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const direction = e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right";
      handleKeyboardMove(direction);
    } else if (e.key === "Enter" && dragState.isKeyboardDragging) {
      e.preventDefault();
      handleKeyboardDrop();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleGlobalKeyDown}
      className="flex flex-col gap-4 p-4
        sm:flex-col sm:overflow-y-auto sm:pb-20
        md:flex-row md:flex-wrap md:justify-center
        lg:flex-nowrap lg:overflow-x-auto lg:pb-10
        xl:mx-auto xl:max-w-[1800px] "
    >
      {columns.map((col) => (
        <KanbanColumnComponent
          key={col.id}
          column={col}
          tasks={col.taskIds.map((id) => tasks[id])}
          handleTaskMove={(
    taskId: string,
    from: string,
    to: string,
    newIndex: number,

          )=>handleTaskMove(taskId, from, to, newIndex, columns, setColumns, tasks, setTasks, onTaskMove, dragState)}
          dragState={dragState}
        />
      ))}
    </div>
  );
};
