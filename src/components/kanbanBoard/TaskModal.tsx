import { useState } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";
import { Button } from "../primitives/Button";

interface TaskModalProps {
  task?: KanbanTask | null;
  columns: KanbanColumn[];
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<KanbanTask>) => void;
  onSave?: (task: Partial<KanbanTask>) => void;
  onDelete: (taskId: string) => void;
  addNewOrEdit: "add" | "edit";
}
export const TaskModal = ({
  task,
  columns,
  onClose,
  onUpdate,
  onDelete,
  onSave,
  addNewOrEdit,
}: TaskModalProps) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>(task || {});
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    const existing = formData.tags ?? [];
    if (existing.includes(t)) {
      setTagInput("");
      return;
    }
    setFormData({ ...formData, tags: [...existing, t] });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const existing = formData.tags ?? [];
    setFormData({ ...formData, tags: existing.filter((t) => t !== tag) });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {addNewOrEdit === "add" ? "Add Task" : "Edit Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div id="modal-description" className="sr-only">
            Update task details below
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
              aria-label="Select task priority"
                value={formData.priority || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as
                      | "low"
                      | "medium"
                      | "high"
                      | "urgent",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee || ""}
                onChange={(e) =>
                  setFormData({ ...formData, assignee: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter assignee name"
              />
            </div>

            {/* Tags management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add tag and press Enter"
                />
                <Button
                  onClick={addTag}
                  variant="ghost"
                  className="px-3 py-2"
                  ariaLabel="Add tag"
                >
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-neutral-100 px-2 py-1 rounded text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-xs text-red-600 px-1"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={
                  formData.dueDate
                    ? formData.dueDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => {
                  if (addNewOrEdit === "add" && onSave) onSave(formData);
                  else if (addNewOrEdit === "edit" && task && onUpdate)
                    onUpdate(task.id, formData);
                  onClose();
                }}
                variant="primary"
                className="flex-1"
                ariaLabel="Save changes to task"
              >
                {addNewOrEdit === "add" ? "Save Changes" : "Update Task"}
              </Button>
              {addNewOrEdit === "edit" && task && (
                <Button
                  onClick={() => {
                    onDelete(task.id);
                  }}
                  variant="danger"
                  ariaLabel="Delete task"
                >
                  Delete
                </Button>
              )}
              <Button
                onClick={() => {
                  setFormData({});
                  onClose();
                }}
                variant="secondary"
                ariaLabel="Cancel editing"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
