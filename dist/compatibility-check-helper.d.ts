export interface CheckCompatibilityOptions {
    oldArtifactsFolder: string;
    newArtifactsFolder: string;
    outFile: string;
    exclude: RegExp | null;
    reportOnly: boolean;
    out: (msg: string, force?: boolean) => void;
}
export declare function checkCompatibility(opts: CheckCompatibilityOptions): Promise<void>;
