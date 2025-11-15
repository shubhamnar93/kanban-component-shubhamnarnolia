import React, { useRef } from "react";
import { type KanbanTask, type KanbanColumn } from "./KanbanBoard.types";
import {
  isOverdue,
  getInitials,
  formatDate,
  borderColor,
  handleKeyDown,
} from "../../utils/task.utils";
import { getPriorityColor } from "../../utils/task.utils";

export const KanbanCard: React.FC<{
  task: KanbanTask;
  handleDragStart: (id: string) => void;
  handleDragEnd: () => void;
  onDragOver: () => void;
  columnId: string;
  handleKeyboardPickUp: (taskId: string, columnId: string) => void;
  handleKeyboardMove: (
    direction: "up" | "down" | "left" | "right",
    columns: KanbanColumn[],
    tasks: Record<string, KanbanTask>,
  ) => void;
  handleKeyboardDrop: () => void;
  isKeyboardDragging: boolean;
  focusedTaskId: string | null;
}> = ({
  task,
  handleDragStart,
  handleDragEnd,
  columnId,
  handleKeyboardPickUp,
  handleKeyboardDrop,
  isKeyboardDragging,
  focusedTaskId,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const isFocused = focusedTaskId === task.id;


  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}`}
      onKeyDown={(e)=>handleKeyDown({e, handleKeyboardPickUp, taskId: task.id, columnId, isKeyboardDragging, handleKeyboardDrop})}
      draggable
      onDragStart={() => {
        setIsDragging(true);
        handleDragStart(task.id);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        handleDragEnd();
      }}
      className={`bg-white border ${borderColor(task.priority || null)} ${isDragging && "shadow-2xl"} ${isFocused && isKeyboardDragging && "ring-2 ring-blue-500"} rounded-lg p-3
      ltr border-s-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mt-2 ${isDragging && "shadow-2xl scale-[1.03] rotate-2 opacity-70 z-50 "} `}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        )}
      </div>
      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {task.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        {task.assignee && (
          <div
            className="w-6 h-6 bg-primary-500 rounded-full tex-white text-xs flex
items-center justify-center"
          >
            {getInitials(task.assignee)}
          </div>
        )}
      </div>
      {task.dueDate && (
        <div
          className={`text-xs mt-2 ${isOverdue(task.dueDate) ? "text-red-600" : "text-neutral-500"}`}
        >
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};
