import { Artifact } from "./internal";
import { ContractVersion, ContractVersionCheckerIndex, ContractVersionDeltaIndex, ContractVersionIndex } from "./version";
import { BuildArtifacts } from "@openzeppelin/upgrades";
/**
 * A mapping {contract name => {@link ContractVersion}}.
 */
export declare class ASTContractVersions {
    readonly contracts: ContractVersionIndex;
    static fromArtifacts: (artifacts: BuildArtifacts) => Promise<ASTContractVersions>;
    constructor(contracts: ContractVersionIndex);
}
/**
 * Gets the version of a contract by calling Contract.getVersionNumber() on
 * the contract deployed bytecode.
 *
 * If the contract version cannot be retrieved, returns version 1.1.0.0 by default.
 */
export declare function getContractVersion(artifact: Artifact): Promise<ContractVersion>;
export declare class ASTContractVersionsChecker {
    readonly contracts: ContractVersionCheckerIndex;
    static create: (oldArtifacts: BuildArtifacts, newArtifacts: BuildArtifacts, expectedVersionDeltas: ContractVersionDeltaIndex) => Promise<ASTContractVersionsChecker>;
    constructor(contracts: ContractVersionCheckerIndex);
    /**
     * @return a new {@link ASTContractVersionsChecker} with the same contracts
     * excluding all those whose names match the {@param exclude} parameters.
     */
    excluding: (exclude: RegExp) => ASTContractVersionsChecker;
    mismatches: () => ASTContractVersionsChecker;
    isEmpty: () => boolean;
}
