"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable camelcase */
const core_1 = require("@oclif/core");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const tmp_1 = tslib_1.__importDefault(require("tmp"));
const compatibility_check_helper_1 = require("../compatibility-check-helper");
class Check extends core_1.Command {
    async run() {
        var _a;
        const { flags } = await this.parse(Check);
        const oldArtifactsFolder = node_path_1.default.resolve(flags.old_contracts);
        const newArtifactsFolder = node_path_1.default.resolve(flags.new_contracts);
        const out = (msg, force) => {
            if (force || !flags.quiet) {
                process.stdout.write(msg);
            }
        };
        const outFile = flags.output_file ? flags.output_file : tmp_1.default.tmpNameSync({});
        const exclude = flags.exclude ? new RegExp(flags.exclude) : null;
        try {
            await (0, compatibility_check_helper_1.checkCompatibility)({
                newArtifactsFolder,
                oldArtifactsFolder,
                out,
                reportOnly: flags.report_only,
                exclude,
                outFile,
            });
        }
        catch (error) {
            console.error(error);
            if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.indexOf("Version mismatch detected")) >= 0) {
                process.exit(1);
            }
            else {
                process.exit(10003);
            }
        }
    }
}
exports.default = Check;
Check.description = "Compatibility check of contracts";
Check.examples = [
    "contract-compatibility-check check -o [old artifacts path] -n [new directory path]",
];
Check.flags = {
    exclude: core_1.Flags.string({
        char: "e",
        description: "Contract name exclusion regex",
    }),
    old_contracts: core_1.Flags.string({
        char: "o",
        description: "Old contracts build artifacts folder",
        required: true,
    }),
    new_contracts: core_1.Flags.string({
        char: "n",
        description: "New contracts build artifacts folder",
        required: true,
    }),
    output_file: core_1.Flags.string({
        char: "f",
        description: "Destination file output for the compatibility report",
    }),
    quiet: core_1.Flags.boolean({
        char: "q",
        description: "Run in quiet mode (no logs)",
        default: false,
    }),
    report_only: core_1.Flags.boolean({
        char: "r",
        description: "Generate only report",
        default: false,
    }),
};
