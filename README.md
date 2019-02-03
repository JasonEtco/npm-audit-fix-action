<h3 align="center">npm-audit-fix-action</h3>
<p align="center"><strong></strong> <a href="https://github.com/features/actions/">GitHub Action</a> that opens a pull request following an <code>npm audit fix --force</code></p>
<br><br>
<p align="center">
  <img width="600" src="https://user-images.githubusercontent.com/10660468/47612046-bf7de700-da48-11e8-85fd-071003a079d4.png" alt="Screenshot of the Action creating a new pull request" />
</p>

### Still todo

- Figure out how to best test Actions
- Smarter logic around when `--force` should be used (if at all)
- It runs `npm audit`, checks the sum vulnerabilities, then `npm audit fix` needed - could that be optimized to one command?
