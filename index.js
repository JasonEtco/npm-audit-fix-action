const { Toolkit } = require('actions-toolkit')
const runAudit = require('./lib/run-audit')
const runAuditFix = require('./lib/run-audit-fix')
const createPR = require('./lib/create-pr')

const tools = new Toolkit()

runAudit(tools)
  .then(async ({ vulnerabilities, numVulnerabilities }) => {
    if (numVulnerabilities === 0) {
      console.log('No vulnerabilities found!')
      return
    }

    const fixResult = await runAuditFix(tools)
    console.log(fixResult)

    return createPR({
      vulnerabilities,
      numVulnerabilities,
      tools
    })
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
