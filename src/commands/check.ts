/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable camelcase */
import { Command, Flags } from "@oclif/core"
import path from "node:path"
import tmp from "tmp"
import { checkCompatibility } from "../compatibility-check-helper"

export default class Check extends Command {
  static description = "Compatibility check of contracts"

  static examples = [
    "contract-compatibility-check check -o [old artifacts path] -n [new directory path]",
  ]

  static flags = {
    exclude: Flags.string({
      char: "e",
      description: "Contract name exclusion regex",
    }),
    old_contracts: Flags.string({
      char: "o",
      description: "Old contracts build artifacts folder",
      required: true,
    }),
    new_contracts: Flags.string({
      char: "n",
      description: "New contracts build artifacts folder",
      required: true,
    }),
    output_file: Flags.string({
      char: "f",
      description: "Destination file output for the compatibility report",
    }),
    quiet: Flags.boolean({
      char: "q",
      description: "Run in quiet mode (no logs)",
      default: false,
    }),
    report_only: Flags.boolean({
      char: "r",
      description: "Generate only report",
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Check)

    const oldArtifactsFolder = path.resolve(flags.old_contracts)
    const newArtifactsFolder = path.resolve(flags.new_contracts)

    const out = (msg: string, force?: boolean): void => {
      if (force || !flags.quiet) {
        process.stdout.write(msg)
      }
    }

    const outFile = flags.output_file ? flags.output_file : tmp.tmpNameSync({})
    const exclude: RegExp | null = flags.exclude ? new RegExp(flags.exclude) : null

    try {
      await checkCompatibility({
        newArtifactsFolder,
        oldArtifactsFolder,
        out,
        reportOnly: flags.report_only,
        exclude,
        outFile,
      })
    } catch (error: any) {
      console.error(error)

      if (error.message?.indexOf("Version mismatch detected") >= 0) {
        process.exit(1)
      } else {
        process.exit(10_003)
      }
    }
  }
}
