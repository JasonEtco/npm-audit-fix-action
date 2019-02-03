const dedent = require('dedent')

module.exports = (vulnerabilities, total) => {
  return dedent`### \`npm audit fix\`

  A total of **${total} vulnerabilities** have been found and fixed. :rocket:

  | Severity | Count |
  | --- | --- |
  ${Object.keys(vulnerabilities).map(key => `| ${key} | ${vulnerabilities[key]} |`).join('\n')}

  ---

  ###### These vulnerabilities were found by running [\`npm audit fix --force\`](https://docs.npmjs.com/cli/audit) in the root directory of your repository.
  `
}
