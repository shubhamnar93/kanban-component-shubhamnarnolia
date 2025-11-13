import React, { useCallback, useRef } from "react";
import { type KanbanTask } from "./KanbanBoard.types";

export const KanbanCard: React.FC<{
  task: KanbanTask;
  handleDragStart: (id: string) => void;
  handleDragEnd: () => void;
  onDragOver: () => void;
}> = ({ task, handleDragStart, handleDragEnd, onDragOver }) => {
  const { current: priorityColors } = useRef({
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    urgent: "bg-purple-100 text-purple-800",
  });
  const isOverdue = useCallback(
    (date: Date) => {
      const dueDate = new Date(date);
      const currentDate = new Date();
      return dueDate < currentDate;
    },
    [task],
  );
  const formatDate = useCallback(
    (date: Date) => {
      const dueDate = new Date(date);
      return dueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    [task],
  );
  const getInitials = useCallback(
    (name: string) => {
      if (!name) return "";
      const parts = name.trim().split(" ");
      if (parts.length === 1) {
        return (parts[0][0] + parts[0][1]).toUpperCase();
      }
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },
    [task],
  );
  return (
    <div
      draggable
      onDragStart={() => handleDragStart(task.id)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      className="bg-white border border-neutral-200 rounded-lg p-3 shadow-sm
hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}
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
          className={`text-xs mt-2 ${isOverdue(task.dueDate) ? "text-red-600" : "textneutral-500"}`}
        >
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};
