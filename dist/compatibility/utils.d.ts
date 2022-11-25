import { BuildArtifacts } from "@openzeppelin/upgrades";
import { Categorizer } from "./categorizer";
import { ASTDetailedVersionedReport } from "./report";
/**
 * Backward compatibility report, based on both the abstract syntax tree analysis of
 * both the storage layout, and code API.
 */
export declare class ASTBackwardReport {
    readonly oldArtifactsFolder: string;
    readonly newArtifactsFolder: string;
    readonly exclude: string;
    readonly report: ASTDetailedVersionedReport;
    static create: (oldArtifactsFolder: string, newArtifactsFolder: string, oldArtifacts: BuildArtifacts, newArtifacts: BuildArtifacts, exclude: RegExp, categorizer: Categorizer, logFunction: (msg: string) => void) => ASTBackwardReport;
    constructor(oldArtifactsFolder: string, newArtifactsFolder: string, exclude: string, report: ASTDetailedVersionedReport);
}
export declare function instantiateArtifacts(buildDirectory: string): BuildArtifacts;
