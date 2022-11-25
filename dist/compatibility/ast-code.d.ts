import { Change } from "./change";
import { BuildArtifacts } from "@openzeppelin/upgrades";
export declare enum Visibility {
    NONE = "",
    EXTERNAL = "external",
    PUBLIC = "public",
    INTERNAL = "internal",
    PRIVATE = "private"
}
export declare enum Mutability {
    NONE = "",
    PURE = "pure",
    VIEW = "view",
    PAYABLE = "payable"
}
/**
 * A compatibility report with all the detected changes from two compiled
 * contract folders.
 */
export declare class ASTCodeCompatibilityReport {
    private readonly changes;
    constructor(changes: Change[]);
    push(...changes: Change[]): void;
    include(other: ASTCodeCompatibilityReport): void;
    getChanges: () => Change[];
}
/**
 * Runs an ast code comparison and returns the spotted changes from the built artifacts given.
 *
 * @param oldArtifacts
 * @param newArtifacts
 */
export declare function reportASTIncompatibilities(oldArtifacts: BuildArtifacts, newArtifacts: BuildArtifacts): ASTCodeCompatibilityReport;
