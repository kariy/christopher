export interface ContractNode {
  id: string;
  position: { x: number; y: number };
  data: {
    contractAddress: string;
    functionName: string;
    functionSignature: string;
    args: any[];
    abi?: any;
    value?: string;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
}

export interface TransactionData {
  nodes: ContractNode[];
  connections: Connection[];
}