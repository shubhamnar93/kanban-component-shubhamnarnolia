import React from "react";
import type{
   KanbanColumn,
   KanbanTask,
} from "./KanbanBoard.types";
import { KanbanCard } from "./KanbanCard";

interface Props {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskMove: (
    taskId: string,
    from: string,
    to: string,
    newIndex: number,
  ) => void;
  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

export const KanbanColumnComponent: React.FC<Props> = ({ column, tasks }) => {
  return (
    <div className="bg-gray-300 rounded-xl p-3 min-w-[280px] max-w-[300px] sm:w-full">
      <header className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-neutral-500">{tasks.length}</span>
      </header>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
