import React from "react";
import { Handle, Position } from "reactflow";
// import { Settings, Trash2 } from "lucide-react";
import type { ContractNode } from "../types";

interface NodeProps {
  data: ContractNode["data"] & {
    onEdit: () => void;
    onDelete: () => void;
  };
  selected: boolean;
}

export const ContractCallNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`rounded-lg shadow-lg p-4 min-w-[250px] border-2 w-[200px] h-[80px] ${
        selected ? "border-blue-500" : "border-gray-200"
      }`}
      style={{ backgroundColor: "white" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white bg-blue-500"
      />

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 truncate flex-1">
          {data.functionName || "Call"}
        </h3>

        {/*<div className="flex gap-1">
          <button
            onClick={data.onEdit}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={data.onDelete}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>*/}
      </div>

      <div className="space-y-1 text-sm">
        <div className="text-gray-600">
          <span className="font-medium">Contract:</span>
          <div className="text-xs text-gray-500 truncate">
            {data.contractAddress || "Not set"}
          </div>
        </div>

        {data.args && data.args.length > 0 && (
          <div className="text-gray-600">
            <span className="font-medium">Args:</span> {data.args.length}
          </div>
        )}

        {data.value && (
          <div className="text-gray-600">
            <span className="font-medium">Value:</span> {data.value} ETH
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};
