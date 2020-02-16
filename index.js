import sha1 from 'sha1';
import lineByLine from 'n-readlines';
import chalk from 'chalk';
const path = require('path');
const fs = require('fs');

const gameDataPath = `${process.env.APPDATA}/../LocalLow/Cygames/PrincessConnectReDive/`;
const soundManifest = path.join(gameDataPath, 'manifest/d59580e97f71d623e7f8f4cf0d8516bffdcf06cb');
const bgmPath = path.join(gameDataPath, 'b');
const outputPath = (process.argv.length && process.argv[2]) || '';

if (!fs.existsSync(outputPath)) {
  throw new Error(chalk.red('Output path does not exist!'));
}

const outputStats = fs.lstatSync(outputPath);
if (!outputStats.isDirectory()) {
  throw new Error(chalk.red('Output path is not a directory. You must specify a directory for output.'));
}

console.log(chalk.yellowBright('Nozomi, starts to sing!'));

// Stream the sound manifest file, look for entries prefixed with 'b'.
let lineRaw;
let isReadDone = false;
const bgmFileList = [];
const liner = new lineByLine(soundManifest);

while ((lineRaw = liner.next()) && !isReadDone) {
  const line = lineRaw.toString('utf8');

  // Expected line: b/bgm_M001.acb,e74a630dbbf39bf004c359a3f61df0eb,common,6816,
  // All the 'b/' lines would be at the located at front part of the file.
  if (line.startsWith('b')) {
    const fileName = line.substring(line.indexOf('/') + 1, line.indexOf(','));

    // Ignore .acb files as it is meaningless.
    if (fileName.endsWith('.acb')) {
      continue;
    }

    const fileNameHashed = sha1(fileName);
    bgmFileList.push({
      fileName,
      fileNameHashed,
    });
  } else {
    isReadDone = true;
  }
}

liner.close();

console.log(chalk.cyan(`Found ${bgmFileList.length} BGMs.`));

bgmFileList.forEach(({ fileName, fileNameHashed }) => {
  const pathToCopy = path.join(bgmPath, fileNameHashed);
  const outputFile = path.join(outputPath, fileName);

  if (fs.existsSync(outputFile)) {
    console.log(`${fileName} already exists. Skipping...`);
  } else {
    fs.copyFileSync(pathToCopy, outputFile);
    console.log(`${fileName} copied.`);
  }


});

console.log(chalk.green('All done. Enjoy!'));
