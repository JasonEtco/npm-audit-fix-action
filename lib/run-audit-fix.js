module.exports = async tools => {
  const args = ['audit', 'fix', '--force', '--package-lock-only']
  if (process.env.DRY_RUN) args.push('--dry-run', '--json')

  const result = await tools.runInWorkspace(
    'npm',
    ['audit', '--json'],
    { reject: false }
  )

  if (result.exitCode && result.exitCode !== 0) {
    const error = result.stderr
    throw new Error(error)
  }

  return result
}
