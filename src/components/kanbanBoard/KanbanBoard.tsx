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
    <div className="flex bg-green-500 gap-4 w-full overflow-x-auto p-4 flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row">
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

