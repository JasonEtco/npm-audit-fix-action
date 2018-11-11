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

module.exports = async ({ tools, vulnerabilities, numVulnerabilities }) => {
  const github = tools.createOctokit()

  const newBranch = createBranchName(tools.context.sha)

  try {
    await github.gitdata.createReference(tools.context.repo({
      ref: 'refs/heads/' + newBranch,
      sha: tools.context.sha
    }))
  } catch (err) {
    // Throw unless the ref already exists
    if (err.code !== 422) throw err
  }

  const tree = await github.gitdata.getTree(tools.context.repo({ tree_sha: tools.context.sha }))
  const newPackageLockContents = tools.getFile('package-lock.json', 'base64')
  await github.repos.updateFile(tools.context.repo({
    path: 'package-lock.json',
    sha: tree.data.tree.find(item => item.path === 'package-lock.json' && item.type === 'blob').sha,
    message: `Fix ${numVulnerabilities} npm vulnerabilities\n${createList(vulnerabilities)}`,
    content: newPackageLockContents,
    branch: newBranch
  }))

  return github.pullRequests.create(tools.context.repo({
    title: `Automatic audit of npm vulnerabilities (${numVulnerabilities} fixed)`,
    base: 'master',
    head: newBranch,
    body: createBody(vulnerabilities, numVulnerabilities)
  }))
}
