import { useEffect, useState } from "react";
import "../../styles/globals.css";
import type { KanbanBoardProps, KanbanTask } from "./KanbanBoard.types";
import { KanbanColumnComponent } from "./KanbanColumn";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { handleTaskMove, handleUpdate } from "../../utils/task.utils";
import { handleGlobalKeyDown } from "../../hooks/useKanbanBoard";
import { TaskModal } from "./TaskModal";
import { handleDelete } from "../../utils/task.utils";
import { handleSaveNew } from "../../utils/task.utils";
import { Modal } from "../primitives/Modal";
import {
  handleColDelete,
  handleColRename,
  handleWipLimit,
} from "../../utils/column.utils";
import { v4 as uuidv4 } from "uuid";

export const KanbanBoard = ({
  columns: initialColumns,
  tasks: initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: KanbanBoardProps) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const dragState = useDragAndDrop();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNewOrEdit, setAddNewOrEdit] = useState<"add" | "edit">("add");
  const [taskToEdit, setTaskToEdit] = useState<string | null>(null);
  const [columnId, setColumnId] = useState<string | null>(null);
  const [showColModal, setShowColModal] = useState<
    "rename" | "wiplimit" | null
  >(null);
  const [colToEdit, setColumnToEdit] = useState<string | null>(null);

  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }

  const handleTaskDelete = (taskId: string, columnId: string) => {
    handleDelete(taskId, columnId, columns, setColumns, tasks, setTasks);
  };

  const handleDuplicate = (taskId: string, columnId: string) => {
    const taskToDuplicate = tasks[taskId];
    if (taskToDuplicate) {
      const newTask: KanbanTask = {
        ...taskToDuplicate,
        id: uuidv4(),
        title: `${taskToDuplicate.title} (Copy)`,
      };
      handleSaveNew(newTask, columnId, columns, setColumns, tasks, setTasks);
    }
  };
  const [selectedTaskIds, setSelectedTaskIds] = useState<
    Record<string, boolean>
  >({});

  const toggleSelect = (taskId: string, checked: boolean) => {
    setSelectedTaskIds((s) => ({ ...s, [taskId]: checked }));
  };

  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  useEffect(() => {
    let newTask = Object.fromEntries(
      Object.entries(initialTasks).filter(([key, task]) => {
        const byAssignee = !filterAssignee || task.assignee === filterAssignee;

        const byTag = !filterTag || task.tags?.includes(filterTag);

        const byPriority = !filterPriority || task.priority === filterPriority;

        return byAssignee && byTag && byPriority;
      }),
    );
    const newColumns = initialColumns.map((col) => ({
      ...col, // ← Create a new object
      taskIds: col.taskIds.filter((id) => newTask[id] !== undefined),
    }));
    setTasks(newTask);
    setColumns(newColumns);
  }, [filterPriority, filterTag, filterAssignee]);

  const massDeleteSelected = () => {
    const ids = Object.keys(selectedTaskIds).filter(
      (id) => selectedTaskIds[id],
    );
    if (ids.length === 0) return;
    ids.forEach((id) => {
      // find containing column
      const col = columns.find((c) => c.taskIds.includes(id));
      if (!col) return;
      handleDelete(id, col.id, columns, setColumns, tasks, setTasks);
      onTaskDelete(id);
    });
    setSelectedTaskIds({});
  };

  return (
    <>
      <div className="flex flex-col gap-2 justify-between md:flex-row mb-3">
        <div className="flex gap-2">
          <select
            value={filterAssignee ?? ""}
            onChange={(e) => setFilterAssignee(e.target.value || null)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All assignees</option>
            {Array.from(
              new Set(
                Object.values(tasks)
                  .map((t) => t.assignee)
                  .filter(Boolean),
              ),
            ).map((a) => (
              <option key={a} value={a as string}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={filterTag ?? ""}
            onChange={(e) => setFilterTag(e.target.value || null)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All tags</option>
            {Array.from(
              new Set(Object.values(tasks).flatMap((t) => t.tags ?? [])),
            ).map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            value={filterPriority ?? ""}
            onChange={(e) => setFilterPriority(e.target.value || null)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className=" flex gap-2">
          <button
            onClick={massDeleteSelected}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete selected
          </button>
          <button
            onClick={() => setSelectedTaskIds({})}
            className="px-3 py-1 border rounded"
          >
            Clear selection
          </button>
        </div>
      </div>
      <div
        tabIndex={0}
        onKeyDown={(e) =>
          handleGlobalKeyDown({
            e,
            dragState,
            columns,
            tasks,
            setColumns,
            setTasks,
            onTaskMove,
          })
        }
        className={`flex flex-col gap-4 p-4
        sm:flex-col sm:overflow-y-auto sm:pb-20
        md:flex-row md:flex-wrap md:justify-center
        lg:flex-nowrap lg:overflow-x-auto lg:pb-10
        xl:mx-auto xl:max-w-[1800px] ${showAddModal && "hidden"}`}
      >
        {columns.map((col) => (
          <KanbanColumnComponent
            setShowAddModal={setShowAddModal}
            key={col.id}
            column={col}
            tasks={col.taskIds.map((id) => tasks[id])}
            handleTaskMove={(
              taskId: string,
              from: string,
              to: string,
              newIndex: number,
            ) =>
              handleTaskMove(
                taskId,
                from,
                to,
                newIndex,
                columns,
                setColumns,
                tasks,
                setTasks,
                onTaskMove,
                dragState,
              )
            }
            dragState={dragState}
            setAddNewOrEdit={setAddNewOrEdit}
            setTaskToEdit={setTaskToEdit}
            setColumnId={setColumnId}
            setShowColModal={setShowColModal}
            setColToEdit={setColumnToEdit}
            onDeleteCol={(colId: string) => {
              handleColDelete({
                columnId: colId,
                columns,
                setColumns,
              });
            }}
            handleTaskDelete={handleTaskDelete}
            handleDuplicate={handleDuplicate}
            selectedTaskIds={selectedTaskIds}
            toggleSelect={toggleSelect}
          />
        ))}
      </div>
      {showAddModal && (
        <TaskModal
          task={taskToEdit ? tasks[taskToEdit] : null}
          onDelete={(taskId) => {
            if (!columnId) return;
            handleDelete(
              taskId,
              columnId,
              columns,
              setColumns,
              tasks,
              setTasks,
            );
            onTaskDelete(taskId);
            setShowAddModal(false);
          }}
          onSave={(formData) => {
            if (columnId) {
              const task = handleSaveNew(
                formData,
                columnId,
                columns,
                setColumns,
                tasks,
                setTasks,
              );
              if (!task) return null;
              onTaskCreate(columnId, task as KanbanTask);
              setShowAddModal(false);
            }
          }}
          onUpdate={(taskId, formData) => {
            handleUpdate(taskId, formData, tasks, setTasks);
            onTaskUpdate(taskId, formData);
            setShowAddModal(false);
          }}
          columns={columns}
          addNewOrEdit={addNewOrEdit}
          onClose={() => {
            setShowAddModal(false);
          }}
        />
      )}
      {showColModal !== null && (
        <Modal
          showColModal={showColModal}
          onWipLimit={(limit) =>
            handleWipLimit({ limit, columnId: colToEdit, columns, setColumns })
          }
          onRename={(colName) =>
            handleColRename({
              colName,
              columnId: colToEdit,
              columns,
              setColumns,
            })
          }
          onClose={() => setShowColModal(null)}
        />
      )}
    </>
  );
};
