import { SmartContractReference, buildSmartContractReference } from "./contract";

export interface NFTReference extends SmartContractReference {

    /**
     * Token ID of the NFT.
     * Always a non-negative integer.
     */
    tokenId: bigint;
};

/**
 * Builds a NFTReference object.
 * @param chainId the chain ID of the NFT. See src/blockchain.ts
 * @param contractAddress the address of the NFT on the specified chainId.
 * @param tokenId the token ID of the NFT within the specified contractAddress.
 * @returns a NFTReference object.
 */
export const buildNFTReference = (
    chainId: number | string,
    contractAddress: string,
    tokenId: bigint | string
): NFTReference => {

    const contract = buildSmartContractReference(chainId, contractAddress);

    if (typeof tokenId === "string") {
        try {
            tokenId = BigInt(tokenId);
        } catch (e) {
            throw new Error(`Invalid token ID: ${tokenId}. All token ID values must be integers.`);
        }
    }

    if (tokenId < 0) {
        throw new Error(`Invalid token ID: ${tokenId}. Must be non-negative.`);
    }

    if (tokenId > 115792089237316195423570985008687907853269984665640564039457584007913129639935n) {
        throw new Error(`Invalid token ID: ${tokenId}. Must be representable as a uint256 value.`);
    }

    return {
        chainId: contract.chainId,
        contractAddress: contract.contractAddress,
        tokenId
    };
}

/**
 * Formats a NFTReference to a string.
 * @param nft: NFTReference - The NFTReference to format.
 * @returns string - The formatted string.
 */
export const fromNFTReferenceToString = (
    nft: NFTReference
  ): string => {
    return `${nft.chainId}:${nft.contractAddress}:${nft.tokenId}`;
};

/**
 * Parses a string formatted as "chainId:contractAddress:tokenId" to a NFTReference.
 * @param nft: string - The string to parse.
 * @returns NFTReference - The NFTReference object for the parsed string.
 */
export const fromStringToNFTReference = (
    nft: string
  ): NFTReference => {
    const parts = nft.split(":");

    if (parts.length !== 3) {
        throw new Error(`Cannot convert: "${nft}" to NFTReference`);
    }

    return buildNFTReference(parts[0], parts[1], parts[2]);
}