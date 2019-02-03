const createBody = require('./create-body')

function createList (vulnerabilities) {
  return Object.keys(vulnerabilities).map(key => `* ${key}: ${vulnerabilities[key]}`).join('\n')
}

/**
 * @param {Object} param0
 * @param {import('actions-toolkit').Toolkit} param0.tools
 */
module.exports = async ({ tools, vulnerabilities, numVulnerabilities }) => {
  const newBranch = `audit-fixer-${tools.context.sha.slice(0, 7)}`

  try {
    await tools.github.git.createRef(tools.context.repo({
      ref: 'refs/heads/' + newBranch,
      sha: tools.context.sha
    }))
  } catch (err) {
    // Throw unless the ref already exists
    if (err.code !== 422) throw err
  }

  const tree = await tools.github.git.getTree(tools.context.repo({ tree_sha: tools.context.sha }))
  const newPackageLockContents = tools.getFile('package-lock.json', 'base64')

  await tools.github.repos.updateFile(tools.context.repo({
    path: 'package-lock.json',
    sha: tree.data.tree.find(item => item.path === 'package-lock.json' && item.type === 'blob').sha,
    message: `Fix ${numVulnerabilities} npm vulnerabilities\n${createList(vulnerabilities)}`,
    content: newPackageLockContents,
    branch: newBranch
  }))

  return tools.github.pullRequests.create(tools.context.repo({
    title: `Automatic audit of npm vulnerabilities (${numVulnerabilities} fixed)`,
    base: 'master',
    head: newBranch,
    body: createBody(vulnerabilities, numVulnerabilities)
  }))
}
