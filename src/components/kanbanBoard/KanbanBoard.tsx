import "../../styles/globals.css";
import type { KanbanBoardProps } from "./KanbanBoard.types";
import { KanbanColumnComponent } from "./KanbanColumn";

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }

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
          onTaskMove={onTaskMove}
          onTaskCreate={onTaskCreate}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      ))}
    </div>
  );
};

