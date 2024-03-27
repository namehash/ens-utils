import { ENSName, ETH_TLD } from "./ensname";
import { NFTReference } from "./nftreference";
import { namehash, labelhash } from 'viem/ens'

// TODO: maybe use `extractChain` in viem? Or maybe better not to make use of viem/chains at all given bundle size concern?
import { mainnet } from 'viem/chains';

// known mainnet registrars
export const WRAPPED_CONTRACT_ADDRESS =
  "0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401";
export const UNWRAPPED_CONTRACT_ADDRESS =
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";

/**
 * Identifies if the provided name is a direct subname of ".eth".
 * 
 * @param name the name to evaluate.
 * @returns true if and only if the name is a direct subname of ".eth".
 */
export function belongsToEthRegistar(name: ENSName): boolean {
    
    // all direct subnames of ".eth" have exactly 2 labels
    if (name.labels.length !== 2) return false;

    // last label must be "eth"
    return name.labels[1] === ETH_TLD;
}

/**
 * Identifies the registrar smart contract for the provided name, if known.
 * 
 * @param name the name to evaluate.
 * @param chainId the id of the chain the name is managed on.
 * @param isWrapped if the name is wrapped or not.
 * @returns the contract address of the registrar smart contract for the provided name and chainId or `null` if the registrar is not known.
 */
export function getKnownRegistrar(name: ENSName, chainId: number, isWrapped: boolean): `0x${string}` | null {
    if (!belongsToEthRegistar(name)) return null;

    // TODO: Add confirmed handling for additional chains.
    if (chainId !== mainnet.id) return null;
    return isWrapped ? WRAPPED_CONTRACT_ADDRESS : UNWRAPPED_CONTRACT_ADDRESS;
}


export function getKnownNFTReference(name: ENSName, chainId: number, isWrapped: boolean): NFTReference | null {
    // TODO: better handle the case of unnormalized or unknown names
    if (name.normalization !== "normalized") return null;

    const registrar = getKnownRegistrar(name, chainId, isWrapped);

    if (registrar === null) return null;

    let tokenId : bigint | null = null;

    switch (registrar) {

        case WRAPPED_CONTRACT_ADDRESS:
            tokenId = BigInt(namehash(name.name));
            break;
        case UNWRAPPED_CONTRACT_ADDRESS:
          if (name.labels.length > 0)
            tokenId = BigInt(labelhash(name.labels[0]));
          break;
    }

    if (tokenId === null) return null;

    return {
        chainId: chainId,
        contractAddress: registrar,
        tokenId: tokenId
    };
}