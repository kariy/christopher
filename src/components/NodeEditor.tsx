import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ContractNode } from '../types';
import { parseABI, getFunctionSignature } from '../lib/ethereum';

interface NodeEditorProps {
  node: ContractNode | null;
  onSave: (node: ContractNode) => void;
  onClose: () => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({ node, onSave, onClose }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [abiInput, setAbiInput] = useState('');
  const [parsedAbi, setParsedAbi] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [functionArgs, setFunctionArgs] = useState<{ [key: string]: string }>({});
  const [value, setValue] = useState('');

  useEffect(() => {
    if (node) {
      setContractAddress(node.data.contractAddress || '');
      setParsedAbi(node.data.abi || []);
      setSelectedFunction(node.data.functionName || '');
      setValue(node.data.value || '');
      
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
    return parsedAbi.filter(item => item.type === 'function');
  };

  const getSelectedFunctionInputs = () => {
    const func = parsedAbi.find(item => 
      item.type === 'function' && item.name === selectedFunction
    );
    return func?.inputs || [];
  };

  const handleSave = () => {
    if (!node) return;
    
    const inputs = getSelectedFunctionInputs();
    const args = inputs.map((_, index) => functionArgs[`arg_${index}`] || '');
    
    const updatedNode: ContractNode = {
      ...node,
      data: {
        ...node.data,
        contractAddress,
        functionName: selectedFunction,
        functionSignature: getFunctionSignature(parsedAbi, selectedFunction) || '',
        abi: parsedAbi,
        args,
        value
      }
    };
    
    onSave(updatedNode);
  };

  if (!node) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Contract Call</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
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
                    {getSelectedFunctionInputs().map((input: any, index: number) => (
                      <div key={index}>
                        <label className="block text-xs text-gray-600 mb-1">
                          {input.name} ({input.type})
                        </label>
                        <input
                          type="text"
                          value={functionArgs[`arg_${index}`] || ''}
                          onChange={(e) => setFunctionArgs({
                            ...functionArgs,
                            [`arg_${index}`]: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter ${input.type}`}
                        />
                      </div>
                    ))}
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
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};