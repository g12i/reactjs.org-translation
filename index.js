const shell = require('shelljs');

module.exports = (req, res) => {
  console.log(shell.exec(`node scripts/runAll.js config.json langs`).stdout);
  res.end(`Executing your thing for you.`);
};
