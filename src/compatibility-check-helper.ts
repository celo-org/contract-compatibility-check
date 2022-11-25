import { writeJsonSync } from "fs-extra"
import { ASTContractVersionsChecker } from "./compatibility/ast-version"
import { DefaultCategorizer } from "./compatibility/categorizer"
import { ASTBackwardReport, instantiateArtifacts } from "./compatibility/utils"

export interface CheckCompatibilityOptions {
  oldArtifactsFolder: string
  newArtifactsFolder: string
  outFile: string
  exclude: RegExp | null
  reportOnly: boolean
  out: (msg: string, force?: boolean) => void
}

export async function checkCompatibility(opts: CheckCompatibilityOptions) {
  const oldArtifacts = instantiateArtifacts(opts.oldArtifactsFolder)
  const newArtifacts = instantiateArtifacts(opts.newArtifactsFolder)

  const backward = ASTBackwardReport.create(
    opts.oldArtifactsFolder,
    opts.newArtifactsFolder,
    oldArtifacts,
    newArtifacts,
    opts.exclude!,
    new DefaultCategorizer(),
    opts.out,
  )

  opts.out?.(`Writing compatibility report to ${opts.outFile} ...`)
  writeJsonSync(opts.outFile, backward, { spaces: 2 })
  opts.out?.("Done\n")

  if (opts.reportOnly) {
    return
  }

  const versionChecker = await ASTContractVersionsChecker.create(
    oldArtifacts,
    newArtifacts,
    backward.report.versionDeltas(),
  )
  const mismatches = versionChecker.excluding(opts.exclude!).mismatches()
  if (!mismatches.isEmpty()) {
    throw new Error(
      `Version mismatch detected:\n${JSON.stringify(mismatches, null, 4)}`,
    )
  }

  opts.out?.("Success! Actual version numbers match expected\n")
}
