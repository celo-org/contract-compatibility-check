"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instantiateArtifacts = exports.ASTBackwardReport = void 0;
const fs_extra_1 = require("fs-extra");
const upgrades_1 = require("@openzeppelin/upgrades");
const ast_code_1 = require("./ast-code");
const ast_layout_1 = require("./ast-layout");
const library_linking_1 = require("./library-linking");
const report_1 = require("./report");
const migrations_config_1 = require("./migrations-config");
/**
 * Backward compatibility report, based on both the abstract syntax tree analysis of
 * both the storage layout, and code API.
 */
class ASTBackwardReport {
    constructor(oldArtifactsFolder, newArtifactsFolder, exclude, report) {
        this.oldArtifactsFolder = oldArtifactsFolder;
        this.newArtifactsFolder = newArtifactsFolder;
        this.exclude = exclude;
        this.report = report;
    }
}
exports.ASTBackwardReport = ASTBackwardReport;
ASTBackwardReport.create = (oldArtifactsFolder, newArtifactsFolder, oldArtifacts, newArtifacts, exclude, categorizer, logFunction) => {
    // Run reports
    logFunction("Running storage report...");
    const storage = (0, ast_layout_1.reportLayoutIncompatibilities)(oldArtifacts, newArtifacts);
    logFunction("Done\n");
    logFunction("Running code report...");
    const code = (0, ast_code_1.reportASTIncompatibilities)(oldArtifacts, newArtifacts);
    logFunction("Done\n");
    logFunction("Running library linking...");
    const libraryLinking = (0, library_linking_1.reportLibraryLinkingIncompatibilities)(migrations_config_1.linkedLibraries, code);
    logFunction("Done\n");
    const fullReports = new report_1.ASTReports(code, storage, libraryLinking).excluding(exclude);
    logFunction("Generating backward report...");
    const versionedReport = report_1.ASTDetailedVersionedReport.create(fullReports, newArtifacts, categorizer);
    logFunction("Done\n");
    return new ASTBackwardReport(oldArtifactsFolder, newArtifactsFolder, exclude === null || exclude === void 0 ? void 0 : exclude.toString(), versionedReport);
};
function ensureValidArtifacts(artifactsPaths) {
    for (const path of artifactsPaths) {
        const artifact = (0, fs_extra_1.readJsonSync)(path);
        if (artifact.ast === undefined) {
            console.error(`ERROR: invalid artifact file found: '${path}'`);
            process.exit(10001);
        }
    }
}
function instantiateArtifacts(buildDirectory) {
    // Check if all jsons in the buildDirectory are valid artifacts,
    // otherwise getBuildArtifacts fail with the enigmatic
    // "Cannot read property 'absolutePath' of undefined"
    ensureValidArtifacts(upgrades_1.Contracts.listBuildArtifacts(buildDirectory));
    try {
        return (0, upgrades_1.getBuildArtifacts)(buildDirectory);
    }
    catch {
        console.error(`ERROR: could not create BuildArtifacts on directory '${buildDirectory}`);
        process.exit(10002);
    }
}
exports.instantiateArtifacts = instantiateArtifacts;
