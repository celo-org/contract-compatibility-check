/// <reference types="node" />
export declare const DEFAULT_VERSION_STRING = "1.1.0.0";
export declare class ContractVersion {
    readonly storage: number;
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    static isValid: (version: string) => boolean;
    static fromString: (version: string) => ContractVersion;
    /**
     * @param version A 128 byte buffer containing the 32 byte storage, major, minor, and patch
     * version numbers.
     */
    static fromGetVersionNumberReturnValue: (version: Buffer) => ContractVersion;
    constructor(storage: number, major: number, minor: number, patch: number);
    toString: () => string;
}
export declare enum Delta {
    None = "=",
    Increment = "+1",
    Reset = "0"
}
export declare const DeltaUtil: {
    applyToNumber: (delta: Delta, n: number) => number;
};
export declare class ContractVersionDelta {
    readonly storage: Delta;
    readonly major: Delta;
    readonly minor: Delta;
    readonly patch: Delta;
    static fromChanges: (storageChanged: boolean, majorChanged: boolean, minorChanged: boolean, patchChanged: boolean) => ContractVersionDelta;
    constructor(storage: Delta, major: Delta, minor: Delta, patch: Delta);
    appliedTo: (version: ContractVersion) => ContractVersion;
    toString: () => string;
    isVersionIncremented: () => boolean;
}
/**
 * A mapping {contract name => {@link ContractVersionDelta}}.
 */
export interface ContractVersionDeltaIndex {
    [contract: string]: ContractVersionDelta;
}
/**
 * A mapping {contract name => {@link ContractVersion}}.
 */
export interface ContractVersionIndex {
    [contract: string]: ContractVersion;
}
/**
 * A version checker for a specific contract.
 */
export declare class ContractVersionChecker {
    readonly oldVersion: ContractVersion;
    readonly newVersion: ContractVersion;
    readonly expectedDelta: ContractVersionDelta;
    constructor(oldVersion: ContractVersion, newVersion: ContractVersion, expectedDelta: ContractVersionDelta);
    expectedVersion: () => ContractVersion;
    matches: () => boolean;
}
/**
 * A mapping {contract name => {@link ContractVersionChecker}}.
 */
export interface ContractVersionCheckerIndex {
    [contract: string]: ContractVersionChecker;
}
