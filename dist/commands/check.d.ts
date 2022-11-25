import { Command } from "@oclif/core";
export default class Check extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        exclude: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        old_contracts: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        new_contracts: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        output_file: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        quiet: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        report_only: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
