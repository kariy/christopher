import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection as FlowConnection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, Save, Upload } from "lucide-react";
import { ContractCallNode } from "./Node";
import { NodeEditor } from "./NodeEditor";
import type { ContractNode } from "../types";
// import { connectWallet, buildTransaction } from "../lib/ethereum";
import { useAccount } from "wagmi";
import { Account, SignIn } from "../lib/account";

const nodeTypes = {
  contractCall: ContractCallNode,
};

export const Playground: React.FC = () => {
  const { isConnected } = useAccount();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [editingNode, setEditingNode] = useState<ContractNode | null>(null);
  // const [isExecuting, setIsExecuting] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: FlowConnection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 3, stroke: "#3b82f6" },
          },
          eds
        )
      ),
    []
  );

  const addNode = () => {
    const nodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: nodeId,
      type: "contractCall",
      position: { x: 100 + nodes.length * 300, y: 200 },
      data: {
        contractAddress: "",
        functionName: "",
        functionSignature: "",
        args: [],
        onEdit: () => handleEditNode(nodeId),
        onDelete: () => handleDeleteNode(nodeId),
      },
    };

    setNodes((nds) => [...nds, newNode]);

    const contractNode: ContractNode = {
      id: newNode.id,
      position: newNode.position,
      data: newNode.data,
    };
    setEditingNode(contractNode);
  };

  const handleEditNode = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const contractNode: ContractNode = {
        id: node.id,
        position: node.position,
        data: node.data,
      };
      setEditingNode(contractNode);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
  };

  const handleSaveNode = (updatedNode: ContractNode) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === updatedNode.id) {
          return {
            ...node,
            data: {
              ...updatedNode.data,
              onEdit: () => handleEditNode(node.id),
              onDelete: () => handleDeleteNode(node.id),
            },
          };
        }
        return node;
      })
    );
    setEditingNode(null);
  };

  // const handleConnectWallet = async () => {
  //   try {
  //   } catch (error) {
  //     console.error("Failed to connect wallet:", error);
  //     alert(
  //       "Failed to connect wallet. Please make sure MetaMask is installed."
  //     );
  //   }
  // };

  // const executeTransaction = async () => {
  //   // if (!wallet) {
  //   //   alert("Please connect your wallet first");
  //   //   return;
  //   // }
  //   // if (nodes.length === 0) {
  //   //   alert("Please add at least one contract call");
  //   //   return;
  //   // }
  //   // setIsExecuting(true);
  //   // try {
  //   //   const orderedNodes = getOrderedNodes();
  //   //   const contractNodes: ContractNode[] = orderedNodes.map((node) => ({
  //   //     id: node.id,
  //   //     position: node.position,
  //   //     data: node.data,
  //   //   }));
  //   //   const provider = wallet.signer.provider;
  //   //   if (!provider) {
  //   //     throw new Error("No provider available");
  //   //   }
  //   //   const transactions = await buildTransaction(contractNodes, provider);
  //   //   for (const tx of transactions) {
  //   //     const txResponse = await wallet.signer.sendTransaction(tx);
  //   //     await txResponse.wait();
  //   //     console.log("Transaction sent:", txResponse.hash);
  //   //   }
  //   //   alert("All transactions executed successfully!");
  //   // } catch (error) {
  //   //   console.error("Transaction failed:", error);
  //   //   alert("Transaction failed. Check console for details.");
  //   // } finally {
  //   //   setIsExecuting(false);
  //   // }
  // };

  // const getOrderedNodes = () => {
  //   const visited = new Set<string>();
  //   const result: Node[] = [];

  //   const visit = (nodeId: string) => {
  //     if (visited.has(nodeId)) return;
  //     visited.add(nodeId);

  //     const incomingEdges = edges.filter((e) => e.target === nodeId);
  //     for (const edge of incomingEdges) {
  //       visit(edge.source);
  //     }

  //     const node = nodes.find((n) => n.id === nodeId);
  //     if (node) result.push(node);
  //   };

  //   nodes.forEach((node) => visit(node.id));
  //   return result;
  // };

  const savePlayground = () => {
    const data = {
      nodes: nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: {
          contractAddress: n.data.contractAddress,
          functionName: n.data.functionName,
          functionSignature: n.data.functionSignature,
          args: n.data.args,
          abi: n.data.abi,
          value: n.data.value,
        },
      })),
      edges,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction-builder.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPlayground = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        const loadedNodes = data.nodes.map((n) => ({
          ...n,
          type: "contractCall",
          data: {
            ...n.data,
            onEdit: () => handleEditNode(n.id),
            onDelete: () => handleDeleteNode(n.id),
          },
        }));

        setNodes(loadedNodes);
        const styledEdges = (data.edges || []).map((edge: Edge) => ({
          ...edge,
          type: "smoothstep",
          animated: true,
          style: { strokeWidth: 3, stroke: "#3b82f6" },
        }));
        setEdges(styledEdges);
      } catch (error) {
        console.error("Failed to load file:", error);
        alert("Failed to load file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Christopher</h1>

          <div className="flex gap-2">
            <button
              onClick={addNode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>

            <button
              onClick={savePlayground}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Load
              <input
                type="file"
                accept=".json"
                onChange={loadPlayground}
                className="hidden"
              />
            </label>

            {isConnected ? <Account /> : <SignIn />}
            {/*) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{account.address}</span>
                <button
                  onClick={executeTransaction}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  {isExecuting ? "Executing..." : "Execute"}
                </button>
              </div>
            )}*/}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {editingNode && (
        <NodeEditor
          node={editingNode}
          onSave={handleSaveNode}
          onClose={() => setEditingNode(null)}
        />
      )}
    </div>
  );
};
