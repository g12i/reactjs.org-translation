const shell = require('shelljs');
const fs = require('fs');
const shell = require('shelljs');
const [cmd, configFile, langsDir] = process.argv.slice(2);
const langFiles = fs.readdirSync(langsDir);

const express = require('express');

const app = express();
app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/sync', function(req, res) {
  res.send('Starting the sync process...');
  console.time('clone-all');
  langFiles.forEach(langFile => {
    const path = `${langsDir}/${langFile}`;
    shell.exec(`node scripts/${cmd}.js ${configFile} ${path}`);
  });
  console.timeEnd('clone-all');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!');
});
