export interface NFTReference {

    // Source chain ID of the NFT
    chainId: number;

    // Contract address of the NFT
    contractAddress: `0x${string}`;

    // Token ID of the NFT
    tokenId: bigint;
};