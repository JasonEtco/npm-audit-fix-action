const path = require('path')
const runAudit = require('./lib/run-audit')
const runAuditFix = require('./lib/run-audit-fix')
const createPR = require('./lib/create-pr')

const pathToWorkspace = process.env.GITHUB_WORKSPACE || path.join(__dirname, '..', '..')

// Payload Vars
const payload = require(process.env.GITHUB_EVENT_PATH)
const owner = payload.repository.owner.login
const repo = payload.repository.name

runAudit(pathToWorkspace)
.then(async ({ vulnerabilities, numVulnerabilities }) => {
  if (numVulnerabilities === 0) {
    console.log('No vulnerabilities found!')
    return
  }

  const fixResult = await runAuditFix(pathToWorkspace)
  console.log(fixResult)

  return createPR({
    vulnerabilities,
    numVulnerabilities,
    pathToWorkspace,
    owner,
    repo,
    sha: process.env.GITHUB_SHA
  })
})
.catch(err => {
  console.error(err)
  process.exit(1)
})
