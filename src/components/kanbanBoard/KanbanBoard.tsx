import { useState } from "react";
import "../../styles/globals.css";
import type { KanbanBoardProps } from "./KanbanBoard.types";
import { KanbanColumnComponent } from "./KanbanColumn";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";

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
  const dragState = useDragAndDrop()


  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }
  const handleTaskMove = (
    taskId: string,
    from: string,
    to: string,
    newIndex: number,
  ) => {
    const sourceCol = columns.find((c) => c.id === from)!;
    const destCol = columns.find((c) => c.id === to)!;
    let sourceIds = sourceCol.taskIds.filter((id) => id !== taskId);
    let destIds = [...destCol.taskIds];

    if (from === to) {
      // Reordering within the same column
      const currentIndex = sourceCol.taskIds.indexOf(taskId);
      if (currentIndex !== -1) {
        sourceIds.splice(newIndex, 0, taskId);
      }
      destIds = sourceIds;
    } else {
      // Moving to a different column
      destIds.splice(newIndex, 0, taskId);
    }

    const updatedCols = columns.map((c) => {
      if (c.id === from && c.id !== to) {
        return { ...c, taskIds: sourceIds };
      } else if (c.id !== from && c.id === to) {
        return { ...c, taskIds: destIds };
      } else if (c.id === from && c.id === to) {
        return { ...c, taskIds: destIds };
      } else {
        return c;
      }
    });

    setColumns(updatedCols);
    if (from !== to) {
      setTasks({
        ...tasks,
        [taskId]: { ...tasks[taskId], status: to },
      });
    }

    onTaskMove(taskId, from, to, newIndex);
    dragState.handleDragEnd();
  };

  return (
    <div
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
          onTaskMove={handleTaskMove}
          dragState={dragState}
        />
      ))}
    </div>
  );
};
