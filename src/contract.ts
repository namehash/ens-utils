import { getAddress } from "viem";
import { BlockchainReference, buildBlockchainReference } from "./blockchain";

export interface SmartContractReference extends BlockchainReference {

    // Contract address
    contractAddress: `0x${string}`;
};

/**
 * Builds a SmartContractReference object.
 * @param chainId the chain ID of the smart contract. See https://chainlist.org/
 * @param contractAddress the address of the smart contract on the specified chainId.
 * @returns a SmartContractReference object.
 */
export const buildSmartContractReference = (
    chainId: number | string,
    contractAddress: string,
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