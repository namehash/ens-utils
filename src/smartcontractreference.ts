import { getAddress } from "viem";
import { buildBlockchainReference } from "./blockchain";

export interface SmartContractReference {

    // Source chain ID of the smart contract
    chainId: number;

    // Contract address of the smart contract
    contractAddress: `0x${string}`;
};

/**
 * Builds a SmartContractReference object.
 * @param chainId the chain ID of the smart contract. See https://chainid.network/
 * @param contractAddress the contract address of the smart contract on the specified chainId.
 * @returns a SmartContractReference object.
 */
export const buildSmartContractReference = (
    chainId: number | string,
    contractAddress: `0x${string}` | string,
): SmartContractReference => {

    const chain = buildBlockchainReference(chainId);

    let address;
    try {
        address = getAddress(contractAddress, chain.chainId);
    } catch (e) {
        throw new Error(`Invalid address: ${contractAddress}`);
    }

    return {
        chainId: chain.chainId,
        contractAddress: address,
    };
}