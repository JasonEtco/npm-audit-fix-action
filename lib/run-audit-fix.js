const execa = require('execa')

module.exports = async cwd => {
  const args = ['audit', 'fix', '--force', '--package-lock-only']
  if (process.env.DRY_RUN) args.push('--dry-run', '--json')

  const result = await execa('npm', args, { cwd, reject: false })

  if (result.exitCode && result.exitCode !== 0) {
    const error = result.stderr
    throw new Error(error)
  }

  return result
}
