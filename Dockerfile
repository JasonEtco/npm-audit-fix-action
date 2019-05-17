FROM node:10-slim

LABEL "com.github.actions.name"="NPM Audit"
LABEL "com.github.actions.description"="Runs an `npm audit fix` and opens a pull request to suggest the fixes."
LABEL "com.github.actions.icon"="lock"
LABEL "com.github.actions.color"="red"

LABEL "repository"="https://github.com/JasonEtco/npm-audit-fix-action"
LABEL "homepage"="https://github.com/JasonEtco/npm-audit-fix-action"
LABEL "maintainer"="Jason Etcovitch <jasonetco@github.com>"

COPY package*.json /
COPY . .

RUN npm ci

ENTRYPOINT ["node", "/index.js"]
