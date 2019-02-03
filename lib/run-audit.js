module.exports = async tools => {
  const result = await tools.runInWorkspace(
    'npm',
    ['audit', '--json'],
    { reject: false }
  )

  try {
    // Try to parse the result as actual JSON
    const json = JSON.parse(result.stdout)
    const vulns = json.metadata.vulnerabilities

    // Get the total count of vulnerabilities
    const keys = Object.keys(vulns)
    const numVulnerabilities = keys.reduce((p, c) => { p += vulns[c]; return p }, 0)
    return { vulnerabilities: vulns, numVulnerabilities }
  } catch (err) {
    throw err
  }
}
