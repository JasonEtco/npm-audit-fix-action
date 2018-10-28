const execa = require('execa')

module.exports = async cwd => {
  const result = await execa('npm', ['audit', '--json'], {
    cwd, reject: false
  })

  try {
    // Try to parse the result as actual JSON
    const json = JSON.parse(result.stdout)
    const vulns = json.metadata.vulnerabilities

    // Get the total count of vulnerabilities
    const keys = Object.keys(vulns)
    const numVulnerabilities = keys.reduce((p, c) => p += vulns[c], 0)
    return { vulnerabilities: vulns, numVulnerabilities }
  } catch (err) {
    throw err
  }
}
