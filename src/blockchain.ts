export interface BlockchainReference {

    /**
     * Chain ID. See https://chainlist.org/
     * Always a positive integer.
     */
    chainId: number;
};

export interface BlockchainMetadata {

    /**
     * Blockchain reference.
     */
    ref: BlockchainReference;

    /**
     * Distinct chain name.
     */
    name: string;

    /**
     * Chain name for display to end users.
     */
    displayName: string;
}

/**
 * Builds a BlockchainReference object.
 * @param chainId the chain ID to reference. See https://chainid.network/
 * @returns a BlockchainReference object.
 */
export const buildBlockchainReference = (
    chainId: number | string,
): BlockchainReference => {

    let chain : number;

    if (typeof chainId === "string") {

        chain = Number.parseInt(chainId);
    } else {
        chain = chainId;
    }

    if (Number.isNaN(chain)) {
        throw new Error(`Invalid chain ID: ${chainId}. All chain IDs must be numbers.`);
    }

    if (!Number.isFinite(chain)) {
        throw new Error(`Invalid chain ID: ${chainId}. All chain IDs must be finite numbers.`);
    }

    if (!Number.isSafeInteger(chain)) {
        throw new Error(`Invalid chain ID: ${chainId}. All chain IDs must be integers.`);
    }

    if (chain <= 0) {
        throw new Error(`Invalid chain ID: ${chainId}. All chain IDs must be positive integers.`);
    }

    return {
        chainId: chain,
    };
}

let knownChains: BlockchainMetadata[] = [];

/**
 * Add a chain to the list of known chains.
 * Throws an error if a chain with the same ID or name is already registered.
 */ 
export const addKnownChain = (
    metadata: BlockchainMetadata
): void => {
    knownChains.every(c => {
        if (c.ref.chainId === metadata.ref.chainId) {
            throw new Error(`Chain with ID ${metadata.ref.chainId} already registered.`);
        }
        if (c.name === metadata.name) {
            throw new Error(`Chain with name ${metadata.name} already registered.`);
        }
        return true;
    });
    knownChains.push(metadata);
}

// starting simple here
addKnownChain({ref: buildBlockchainReference(1), name: "mainnet", displayName: "Ethereum Mainnet" });
addKnownChain({ref: buildBlockchainReference(11155111), name: "sepolia", displayName: "Sepolia" });

/**
 * Get a blockchain by name (case-insensitive).
 * @param name name of the blockchain to get.
 * @returns A `BlockchainReference` object if the blockchain is known, otherwise `null`.
 */
export const getBlockchainByName = (
    name: string
): BlockchainReference | null => {
    const chain = knownChains.find(c => c.name === name);
    if (!chain) return null;
    return chain.ref;
}

/**
 * Get the blockchain metadata for a given reference.
 * @param ref blockchain reference to get metadata for.
 * @returns A `BlockchainMetadata` object if the blockchain is known, otherwise `null`.
 */
export const getBlockchainMetadata = (
    ref: BlockchainReference
): BlockchainMetadata | null => {
    const chain = knownChains.find(c => c.ref.chainId === ref.chainId);
    if (!chain) return null;
    return chain;
}