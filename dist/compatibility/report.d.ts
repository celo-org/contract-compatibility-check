import { BuildArtifacts } from "@openzeppelin/upgrades";
import { ASTCodeCompatibilityReport } from "./ast-code";
import { ASTStorageCompatibilityReport } from "./ast-layout";
import { Categorizer } from "./categorizer";
import { Change } from "./change";
import { ContractVersionDelta, ContractVersionDeltaIndex } from "./version";
/**
 * Value object holding all uncategorized storage and code reports.
 */
export declare class ASTReports {
    readonly code: ASTCodeCompatibilityReport;
    readonly storage: ASTStorageCompatibilityReport[];
    readonly libraryLinking: Change[];
    constructor(code: ASTCodeCompatibilityReport, storage: ASTStorageCompatibilityReport[], libraryLinking: Change[]);
    /**
     * @return a new {@link ASTReports} with the same storage and code
     * reports, excluding all contract names that match the {@param exclude}
     * parameter.
     */
    excluding: (exclude: RegExp) => ASTReports;
}
/**
 * A mapping {contract name => {@link CategorizedChanges}}.
 */
export interface CategorizedChangesIndex {
    [contract: string]: CategorizedChanges;
}
/**
 * A semantic versioning categorization of a list of contract storage
 * and code changes.
 */
export declare class CategorizedChanges {
    readonly storage: ASTStorageCompatibilityReport[];
    readonly major: Change[];
    readonly minor: Change[];
    readonly patch: Change[];
    /**
     * @returns a new {@link CategorizedChanges} according to
     * the {@link Categorizer} given.
     */
    static fromReports(reports: ASTReports, categorizer: Categorizer): CategorizedChanges;
    constructor(storage: ASTStorageCompatibilityReport[], major: Change[], minor: Change[], patch: Change[]);
    /**
     * @returns a mapping {contract name => {@link CategorizedChanges}}
     */
    byContract: () => CategorizedChangesIndex;
}
/**
 * A mapping {contract name => {@link ASTVersionedReport}}.
 */
export interface ContractReports {
    [contract: string]: ASTVersionedReport;
}
export interface ASTVersionedReportIndex {
    contracts: ContractReports;
    libraries: CategorizedChangesIndex;
}
export declare const isLibrary: (contract: string, artifacts: BuildArtifacts) => boolean;
/**
 * Backward compatibility report for a set of changes, based on
 * the abstract syntax tree analysis of both the storage layout, and code API.
 *
 * Holds {@link CategorizedChanges} and the calculated {@link ContractVersionDelta}.
 */
export declare class ASTVersionedReport {
    readonly changes: CategorizedChanges;
    readonly versionDelta: ContractVersionDelta;
    /**
     * @returns a new {@link ASTVersionedReport} with the provided
     * {@link CategorizedChanges} and a calculated version delta
     * according to {@link ContractVersionDelta.fromChanges}.
     */
    static create: (changes: CategorizedChanges) => ASTVersionedReport;
    /**
     * @return a new {@link ASTVersionedReportIndex} defined by
     * {contract name => {@link ASTVersionedReport}}, each built
     * by the {@link CategorizedChanges} for each contract.
     */
    static createByContract: (changes: CategorizedChanges, artifacts: BuildArtifacts) => ASTVersionedReportIndex;
    constructor(changes: CategorizedChanges, versionDelta: ContractVersionDelta);
}
/**
 * A report holding detailed {@link ASTVersionedReport} for each contract and library.
 */
export declare class ASTDetailedVersionedReport {
    readonly contracts: ContractReports;
    readonly libraries: CategorizedChangesIndex;
    static create: (fullReports: ASTReports, artifacts: BuildArtifacts, categorizer: Categorizer) => ASTDetailedVersionedReport;
    constructor(contracts: ContractReports, libraries: CategorizedChangesIndex);
    versionDeltas: () => ContractVersionDeltaIndex;
}
