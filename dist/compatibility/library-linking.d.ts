import { ASTCodeCompatibilityReport } from "./ast-code";
import { LibraryLinkingChange } from "./change";
export declare const reportLibraryLinkingIncompatibilities: (linkedLibraries: {
    [library: string]: string[];
}, codeReport: ASTCodeCompatibilityReport) => LibraryLinkingChange[];
