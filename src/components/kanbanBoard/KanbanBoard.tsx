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
  const dragState = useDragAndDrop();

  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }

  // taskId, fromColumnId, toColumnId, newindextask -> void
  const handleTaskMove = (
    taskId: string,
    from: string,
    to: string,
    newIndex: number,
  ) => {
    // find the from Column
    const fromCol = columns.find((c) => c.id === from)!;
    // find the to Column
    const toCol = columns.find((c) => c.id === to)!;
    // remove the task from "from Column" and recreate entire taskId from the column
    let fromColIds = fromCol.taskIds.filter((id) => id !== taskId);
    // recreate taskIds column form the toColumn
    let toColsIds = [...toCol.taskIds];

    if (from === to) {
      // Reordering within the same column
      fromColIds.splice(newIndex, 0, taskId);
      // both toColsIds and fromColIds is the same col and have the task
      toColsIds = fromColIds;
    } else {
      // add the task to new index in the new col
      toColsIds.splice(newIndex, 0, taskId);
    }
    //create all column again and change the fromCol and toCol
    const updatedCols = columns.map((c) => {
      if (c.id === from) {
        return { ...c, taskIds: fromColIds };
      } else if (c.id === to) {
        return { ...c, taskIds: toColsIds };
      } else {
        return c;
      }
    });
    //set Columns to updatedCols
    setColumns(updatedCols);

    //set the task draged staus if it is not dragged just to change index
    if (from !== to) {
      setTasks({
        ...tasks,
        [taskId]: { ...tasks[taskId], status: to },
      });
    }
    // on Taskmove which is a user function  which is also called
    onTaskMove(taskId, from, to, newIndex);
    // lastly set all the from, to, index, taskId to null and  isDragging to false
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
          handleTaskMove={handleTaskMove}
          dragState={dragState}
        />
      ))}
    </div>
  );
};
