const fs = require('fs').promises;
const path = require('path');
const ExifParser = require('exif-parser');

async function getImageMetadata(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = ExifParser.create(buffer);
  const metadata = parser.parse();
  return metadata;
}

async function getImagesWithMetadata(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    const imageExtensions = ['jpg', 'jpeg', 'png','HEIC'];
    const imageFiles = files.filter(file => {
      const extension = file.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    });
    const imagesWithMetadata = await Promise.all(imageFiles.map(async imageFile => {
      try {
        const imagePath = path.join(folderPath, imageFile);
        const metadata = await getImageMetadata(imagePath);
        return { 
            name: imageFile,
            metadata : {
                date: metadata.tags.DateTimeOriginal,
            }
        }
      } catch (err) {
        console.error(`Error processing file ${imageFile}:`, err);
        return null;
      }
    }));
    return imagesWithMetadata;
  } catch (err) {
    console.error(`Error reading directory ${folderPath}:`, err);
    return [];
  }
}


const folderPath = './PhotographyFolder/';
getImagesWithMetadata(folderPath)
  .then(imagesWithMetadata => console.log(imagesWithMetadata))
  .catch(err => console.error('Error getting images with metadata:', err));



