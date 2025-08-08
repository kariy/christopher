import { ethers } from "ethers";
import type { ContractNode } from "../types";

export const parseABI = (abiString: string) => {
  try {
    const abi = JSON.parse(abiString);
    return abi;
  } catch (error) {
    console.error("Invalid ABI format:", error);
    return null;
  }
};

export const getFunctionSignature = (abi: any[], functionName: string) => {
  const func = abi.find(
    (item) => item.type === "function" && item.name === functionName
  );

  if (!func) return null;

  const params = func.inputs.map((input: any) => input.type).join(",");
  return `${functionName}(${params})`;
};

export const encodeFunction = (
  abi: any[],
  functionName: string,
  args: any[]
) => {
  const iface = new ethers.Interface(abi);
  return iface.encodeFunctionData(functionName, args);
};

export const buildTransaction = async (nodes: ContractNode[]) => {
  const transactions = nodes.map((node) => ({
    to: node.data.contractAddress,
    data: encodeFunction(node.data.abi, node.data.functionName, node.data.args),
    value: node.data.value ? ethers.parseEther(node.data.value) : 0,
  }));

  return transactions;
};

export const connectWallet = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  return { provider, signer };
};
