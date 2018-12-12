FROM node:10-slim

LABEL "com.github.actions.name"="NPM Audit"
LABEL "com.github.actions.description"="Runs an `npm audit fix` and opens a pull request to suggest the fixes."
LABEL "com.github.actions.icon"="lock"
LABEL "com.github.actions.color"="red"

LABEL "repository"="http://github.com/JasonEtco/npm-audit-fix-action"
LABEL "homepage"="http://github.com/JasonEtco/npm-audit-fix-action"
LABEL "maintainer"="Jason Etcovitch <jasonetco@github.com>"

ADD package.json /package.json
ADD package-lock.json /package-lock.json
WORKDIR /
COPY . /

RUN npm ci

ENTRYPOINT ["node", "/index.js"]
