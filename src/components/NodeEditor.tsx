import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ContractNode } from "../types";
import { parseABI, getFunctionSignature } from "../lib/ethereum";

interface NodeEditorProps {
  node: ContractNode | null;
  onSave: (node: ContractNode) => void;
  onClose: () => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  onSave,
  onClose,
}) => {
  const [contractAddress, setContractAddress] = useState("");
  const [abiInput, setAbiInput] = useState("");
  const [parsedAbi, setParsedAbi] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [functionArgs, setFunctionArgs] = useState<{ [key: string]: string }>(
    {}
  );
  const [value, setValue] = useState("");

  useEffect(() => {
    if (node) {
      setContractAddress(node.data.contractAddress || "");
      setParsedAbi(node.data.abi || []);
      setSelectedFunction(node.data.functionName || "");
      setValue(node.data.value || "");

      if (node.data.args) {
        const argsObj: { [key: string]: string } = {};
        node.data.args.forEach((arg, index) => {
          argsObj[`arg_${index}`] = String(arg);
        });
        setFunctionArgs(argsObj);
      }
    }
  }, [node]);

  const handleAbiParse = () => {
    const abi = parseABI(abiInput);
    if (abi) {
      setParsedAbi(abi);
    }
  };

  const getFunctions = () => {
    return parsedAbi.filter((item) => item.type === "function");
  };

  const getSelectedFunctionInputs = () => {
    const func = parsedAbi.find(
      (item) => item.type === "function" && item.name === selectedFunction
    );
    return func?.inputs || [];
  };

  const handleSave = () => {
    if (!node) return;

    const inputs = getSelectedFunctionInputs();
    const args = inputs.map((_, index) => functionArgs[`arg_${index}`] || "");

    const updatedNode: ContractNode = {
      ...node,
      data: {
        ...node.data,
        contractAddress,
        functionName: selectedFunction,
        functionSignature:
          getFunctionSignature(parsedAbi, selectedFunction) || "",
        abi: parsedAbi,
        args,
        value,
      },
    };

    onSave(updatedNode);
  };

  if (!node) return null;

  return (
    <div className="absolute right-5 bottom-5 top-25 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl w-[400px] overflow-hidden border h-full">
        <div className="flex justify-between items-center bg-black py-2 px-[15px]">
          <h2 className="text-xl font-semibold text-white">Function Call</h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-80 bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-[15px]">
          <div className="py-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Address
              </label>
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0x..."
              />
            </div>

            {parsedAbi.length === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract ABI
                </label>
                <textarea
                  value={abiInput}
                  onChange={(e) => setAbiInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Paste contract ABI JSON here..."
                />
                <button
                  onClick={handleAbiParse}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Parse ABI
                </button>
              </div>
            )}

            {parsedAbi.length > 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Function
                  </label>
                  <select
                    value={selectedFunction}
                    onChange={(e) => {
                      setSelectedFunction(e.target.value);
                      setFunctionArgs({});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a function</option>
                    {getFunctions().map((func, index) => (
                      <option key={index} value={func.name}>
                        {func.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedFunction && getSelectedFunctionInputs().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Function Arguments
                    </label>
                    <div className="space-y-2">
                      {getSelectedFunctionInputs().map(
                        (input: any, index: number) => (
                          <div key={index}>
                            <label className="block text-xs text-gray-600 mb-1">
                              {input.name} ({input.type})
                            </label>
                            <input
                              type="text"
                              value={functionArgs[`arg_${index}`] || ""}
                              onChange={(e) =>
                                setFunctionArgs({
                                  ...functionArgs,
                                  [`arg_${index}`]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`Enter ${input.type}`}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ETH Value (optional)
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white hover:opacity-80 w-full uppercase"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
