"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCompatibility = void 0;
const fs_extra_1 = require("fs-extra");
const ast_version_1 = require("./compatibility/ast-version");
const categorizer_1 = require("./compatibility/categorizer");
const utils_1 = require("./compatibility/utils");
async function checkCompatibility(opts) {
    var _a, _b, _c;
    const oldArtifacts = (0, utils_1.instantiateArtifacts)(opts.oldArtifactsFolder);
    const newArtifacts = (0, utils_1.instantiateArtifacts)(opts.newArtifactsFolder);
    const backward = utils_1.ASTBackwardReport.create(opts.oldArtifactsFolder, opts.newArtifactsFolder, oldArtifacts, newArtifacts, opts.exclude, new categorizer_1.DefaultCategorizer(), opts.out);
    (_a = opts.out) === null || _a === void 0 ? void 0 : _a.call(opts, `Writing compatibility report to ${opts.outFile} ...`);
    (0, fs_extra_1.writeJsonSync)(opts.outFile, backward, { spaces: 2 });
    (_b = opts.out) === null || _b === void 0 ? void 0 : _b.call(opts, "Done\n");
    if (opts.reportOnly) {
        return;
    }
    const versionChecker = await ast_version_1.ASTContractVersionsChecker.create(oldArtifacts, newArtifacts, backward.report.versionDeltas());
    const mismatches = versionChecker.excluding(opts.exclude).mismatches();
    if (!mismatches.isEmpty()) {
        throw new Error(`Version mismatch detected:\n${JSON.stringify(mismatches, null, 4)}`);
    }
    (_c = opts.out) === null || _c === void 0 ? void 0 : _c.call(opts, "Success! Actual version numbers match expected\n");
}
exports.checkCompatibility = checkCompatibility;
