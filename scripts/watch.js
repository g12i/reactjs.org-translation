// const interval = 10 * 60 * 1000; // Run every ten minutes
const interval = 10 * 1000;

const fs = require('fs');
const shell = require('shelljs');

const [srcConfigFile, langsDir] = process.argv.slice(2);
const langFiles = fs.readdirSync(langsDir);
const {owner, repository} = getJSON(srcConfigFile);

function getJSON(file) {
  // Get content from file
  return JSON.parse(fs.readFileSync(file));
}

if (!srcConfigFile) {
  throw new Error('Source config file not provided');
}
if (!langsDir) {
  throw new Error('Language config directory not provided');
}

if (shell.cd('repo').code !== 0) {
  console.log('[watch] repo directory does not exist; creating...');
  shell.mkdir('repo');
  shell.cd('repo');
}

// const {code: langCode, name: langName, maintainers} = getJSON(langConfigFile);
const originalUrl = `https://github.com/${owner}/${repository}.git`;
if (shell.cd(repository).code !== 0) {
  console.log(`[watch] Can't find source repo locally. Cloning it...`);
  shell.exec(`git clone ${originalUrl} ${repository}`);
  console.log(`[watch] Finished cloning.`);
  shell.cd(repository);
}

setInterval(() => {
  // pull from the original repo and see if there are any changes
  console.log('[watch]: checking for updates...');
  const output = shell.exec('git pull origin master').stdout;
  if (output.includes('Already up to date')) {
    console.log('[watch]: no changes detected');
    return;
  }

  shell.cd('../../');
  langFiles.forEach(langFile => {
    const path = `${langsDir}/${langFile}`;
    shell.exec(`node scripts/sync.js ${srcConfigFile} ${path}`);
  });
  shell.cd(`repo/${repository}`);
}, interval);
