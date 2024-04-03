import { getAddress } from "viem";

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


    let chain : number;

    if (typeof chainId === "string") {

        chain = Number(chainId);

        if (Number.isNaN(chain)) {
            throw new Error(`Invalid chain ID: ${chainId}`);
        }
    } else {
        chain = chainId
    }

    if (chain % 1 !== 0) {
        throw new Error(`Invalid chain ID: ${chainId}`);
    }

    if (chain <= 0) {
        throw new Error(`Invalid chain ID: ${chainId}`);
    }

    let address;
    try {
        address = getAddress(contractAddress, chain);
    } catch (e) {
        throw new Error(`Invalid address: ${contractAddress}`);
    }

    return {
        chainId: chain,
        contractAddress: address,
    };
}