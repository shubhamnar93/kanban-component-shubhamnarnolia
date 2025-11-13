import React, { StrictMode } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";
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
    <StrictMode>
      <div className="bg-gray-300 rounded-xl p-3 flex flex-col w-full max-h-[500px] sm:w-full md:w-[280px] lg:max-h-[823px] lg:w-[320px]">
        <header className="flex justify-between items-center mb-3 sticky top-0 bg-gray-300  ">
          <h3 className="font-semibold">{column.title}</h3>
          <span className="text-sm text-neutral-500">{tasks.length}</span>
        </header>
        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin">
          {tasks.length === 0 ? (
            <div className="text-sm text-neutral-400 italic py-6 text-center">
              No tasks
            </div>
          ) : (
            tasks.map((task) => <KanbanCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    </StrictMode>
  );
};
