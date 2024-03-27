const fs = require('fs');
const path = require('path');

const directoryPath = '.';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);

    // Check if the file is a JSON file
    if (path.extname(file) === '.json') {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}:`, err);
          return;
        }

        try {
          const jsonData = JSON.parse(data);

          // Iterate through each object in the array
          jsonData.words.forEach(obj => {
            if (obj.alignedWord === '<unk>') {
              obj.alignedWord = obj.word;
            }
          });

          // Save the modified JSON back to the file
          fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', err => {
            if (err) {
              console.error(`Error writing file ${file}:`, err);
            } else {
              console.log(`File ${file} successfully updated.`);
            }
          });
        } catch (jsonErr) {
          console.error(`Error parsing JSON from file ${file}:`, jsonErr);
        }
      });
    }
  });
});