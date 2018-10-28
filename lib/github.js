// Instantiate Octokit
const GitHub = require('@octokit/rest')

module.exports = () => {
  const octokit = new GitHub()
  octokit.authenticate({
    type: 'token',
    token: process.env.GITHUB_TOKEN
  })

  return octokit
}
