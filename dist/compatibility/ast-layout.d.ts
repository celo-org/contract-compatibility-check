import { Artifact } from "./internal";
import { BuildArtifacts, StorageLayoutInfo } from "@openzeppelin/upgrades";
export declare const getLayout: (artifact: Artifact, artifacts: BuildArtifacts) => StorageLayoutInfo;
export interface ASTStorageCompatibilityReport {
    contract: string;
    compatible: boolean;
    errors: string[];
    expanded?: boolean;
}
export declare const generateCompatibilityReport: (oldArtifact: Artifact, oldArtifacts: BuildArtifacts, newArtifact: Artifact, newArtifacts: BuildArtifacts) => {
    contract: string;
    compatible: boolean;
    errors: any[];
    expanded?: boolean;
};
export declare const reportLayoutIncompatibilities: (oldArtifacts: BuildArtifacts, newArtifacts: BuildArtifacts) => ASTStorageCompatibilityReport[];
