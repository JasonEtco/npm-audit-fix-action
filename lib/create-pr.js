const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const createOctokit = require('./github')
const readFile = promisify(fs.readFile)
const dedent = require('dedent')

function createList (vulnerabilities) {
  return Object.keys(vulnerabilities).map(key => `* ${key}: ${vulnerabilities[key]}`).join('\n')
}

function createTable (vulnerabilities) {
  return Object.keys(vulnerabilities).map(key => `| ${key} | ${vulnerabilities[key]} |`).join('\n')
}

function createBody (vulnerabilities, total) {
  return dedent`### \`npm audit fix\`

  A total of **${total} vulnerabilities** have been found and fixed. :rocket:

  | Severity | Count |
  | --- | --- |
  ${createTable(vulnerabilities)}

  ---

  ###### These vulnerabilities were found by running [\`npm audit fix --force\`](https://docs.npmjs.com/cli/audit) in the root directory of your repository.
  `
}

function createBranchName (sha) {
  return `audit-fixer-${sha.slice(0, 7)}`
}

module.exports = async ({ pathToWorkspace, owner, repo, sha, vulnerabilities, numVulnerabilities }) => {
  const github = createOctokit()

  const newBranch = createBranchName(sha)

  try {
    await github.gitdata.createReference({
      ref: 'refs/heads/' + newBranch,
      owner, repo, sha
    })
  } catch (err) {
    // Throw unless the ref already exists
    if (err.code !== 422) throw err
  }

  const tree = await github.gitdata.getTree({ owner, repo, tree_sha: sha })
  const newPackageLockContents = await readFile(path.join(pathToWorkspace, 'package-lock.json'), 'base64')
  await github.repos.updateFile({
    path: 'package-lock.json',
    sha: tree.data.tree.find(item => item.path === 'package-lock.json' && item.type === 'blob').sha,
    message: `Fix ${numVulnerabilities} npm vulnerabilities\n${createList(vulnerabilities)}`,
    content: newPackageLockContents,
    branch: newBranch,
    owner, repo
  })

  return github.pullRequests.create({
    title: `Automatic audit of npm vulnerabilities (${numVulnerabilities} fixed)`,
    base: 'master',
    head: newBranch,
    body: createBody(vulnerabilities, numVulnerabilities),
    owner, repo
  })
}
