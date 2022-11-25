"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryTx = void 0;
const tslib_1 = require("tslib");
/* tslint:disable:no-console */
// TODO(asa): Refactor and rename to 'deployment-utils.ts'
const prompts_1 = tslib_1.__importDefault(require("prompts"));
async function retryTx(fn, args) {
    while (true) {
        try {
            const rvalue = await fn(...args);
            return rvalue;
        }
        catch (error) {
            console.error(error);
            // @ts-ignore
            const { confirmation } = await (0, prompts_1.default)({
                type: "confirm",
                name: "confirmation",
                // @ts-ignore: typings incorrectly only accept string.
                initial: true,
                message: "Error while sending tx. Try again?",
            });
            if (!confirmation) {
                throw error;
            }
        }
    }
}
exports.retryTx = retryTx;
