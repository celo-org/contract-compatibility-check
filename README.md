# Contract compatibility check
This tool checks smart contract proxy storage compatibility of changes to the code.

## Run compatibility check
```
USAGE
  $ contract-compatibility-check run -o <old artifacts path> -n <new artifacts path>

FLAGS
  -n, --new_contracts=<value>  (required) New contracts build artifacts folder
  -o, --old_contracts=<value>  (required) Old contracts build artifacts folder
  -e, --exclude=<value>  (optional) Contract name exclusion regex
  -f, --output_file=<value>  (optional)  Destination file output for the compatibility report
  -q, --quiet=<value>  (optional)  Run in quiet mode (no logs)
  -r, --report_only=<value>  (optional)  "Generate only report"


EXAMPLES
  $  contract-compatibility-check run -o /var/old_artifacts -n /var/new_artifacts
```
