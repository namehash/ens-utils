import { getAddress } from "viem";

export interface NFTReference {

    // Source chain ID of the NFT
    chainId: number;

    // Contract address of the NFT
    contractAddress: `0x${string}`;

    // Token ID of the NFT
    tokenId: bigint;
};

/**
 * Builds a NFTReference object.
 * @param chainId the chain ID of the NFT. See https://chainid.network/
 * @param contractAddress the contract address of the NFT on the specified chainId.
 * @param tokenId the token ID of the NFT within the specified contractAddress.
 * @returns a NFTReference object.
 */
export const buildNFTReference = (
    chainId: number | string,
    contractAddress: `0x${string}` | string,
    tokenId: bigint | string
): NFTReference => {


    let chain : number;

    if (typeof chainId === "string") {

        chain = Number(chainId);

        if (Number.isNaN(chain)) {
            throw new Error(`Invalid chain ID: ${chainId} in buildNFTReference`);
        }
    } else {
        chain = chainId
    }

    if (chain % 1 !== 0) {
        throw new Error(`Invalid chain ID: ${chainId} in buildNFTReference`);
    }

    if (chain <= 0) {
        throw new Error(`Invalid chain ID: ${chainId} in buildNFTReference`);
    }

    let address;
    try {
        address = getAddress(contractAddress, chain);
    } catch (e) {
        throw new Error(`Invalid address: ${contractAddress} in buildNFTReference`);
    }

    if (typeof tokenId === "string") {
        try {
            tokenId = BigInt(tokenId);
        } catch (e) {
            throw new Error(`Invalid token ID: ${tokenId} in buildNFTReference`);
        }
    }

    if (tokenId < 0) {
        throw new Error(`Invalid token ID: ${tokenId} in buildNFTReference`);
    }

    return {
        chainId: chain,
        contractAddress: address,
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