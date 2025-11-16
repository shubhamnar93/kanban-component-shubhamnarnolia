import { useState } from "react";
import { Button } from "./Button";

interface ModalProps {
  showColModal: "rename" | "wiplimit";
  onClose: () => void;
  onRename: (colName: string) => void;
  onWipLimit: (limit: number) => void;
}

export const Modal = ({
  showColModal,
  onClose,
  onRename,
  onWipLimit,
}: ModalProps) => {
  const [colName, setColName] = useState("");
  const [wipLimit, setWipLimit] = useState(0);
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
              {showColModal === "rename" ? "Rename" : "Change Limit"}
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
            Update column details below
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {showColModal === "rename" ? "Title" : "Limit"}
                <span className="text-red-500">*</span>
              </label>
              {showColModal === "rename" ? (
                <input
                  type="text"
                  value={colName || ""}
                  onChange={(e) => setColName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  aria-required="true"
                />
              ) : (
                <input
                  type="number"
                  value={wipLimit || ""}
                  onChange={(e) => setWipLimit(Number(e.target.value))}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => {
                if (showColModal === "rename") onRename(colName);
                else onWipLimit(wipLimit);
                onClose();
              }}
              variant="primary"
              className="flex-1"
              ariaLabel="Save changes to task"
            >
              Update Task
            </Button>
            <Button
              onClick={() => {
                setWipLimit(0);
                setTimeout("");
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
  );
};
