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
    const imageExtensions = ['jpg', 'jpeg', 'png','HEIC', "PNG"];
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
                Make : metadata.tags.Make ? metadata.tags.Make : null,
                Model : metadata.tags.Model ? metadata.tags.Model : null,
                Orientation : metadata.tags.Orientation ? metadata.tags.Orientation : null,
                XResolution : metadata.tags.XResolution ? metadata.tags.XResolution : null,
                YResolution : metadata.tags.YResolution ? metadata.tags.YResolution : null,
                ResolutionUnit : metadata.tags.ResolutionUnit ? metadata.tags.ResolutionUnit : null,
                Software : metadata.tags.Software ? metadata.tags.Software : null,
                ModifyDate : metadata.tags.ModifyDate ? metadata.tags.ModifyDate : null,
                TileWidth : metadata.tags.TileWidth ? metadata.tags.TileWidth : null,
                TileLength : metadata.tags.TileLength ? metadata.tags.TileLength : null,
                ExposureTime : metadata.tags.ExposureTime ? metadata.tags.ExposureTime : null,
                FNumber : metadata.tags.FNumber ? metadata.tags.FNumber : null,
                ExposureProgram : metadata.tags.ExposureProgram ? metadata.tags.ExposureProgram : null,
                ISO : metadata.tags.ISO ? metadata.tags.ISO : null,
                DateTimeOriginal : metadata.tags.DateTimeOriginal ? metadata.tags.DateTimeOriginal : null,
                CreateDate : metadata.tags.CreateDate ? metadata.tags.CreateDate : null,
                undefined : metadata.tags.undefined ? metadata.tags.undefined : null,
                ShutterSpeedValue : metadata.tags.ShutterSpeedValue ? metadata.tags.ShutterSpeedValue : null,
                ApertureValue : metadata.tags.ApertureValue ? metadata.tags.ApertureValue : null,
                BrightnessValue : metadata.tags.BrightnessValue ? metadata.tags.BrightnessValue : null,
                ExposureCompensation : metadata.tags.ExposureCompensation ? metadata.tags.ExposureCompensation : null,
                MeteringMode : metadata.tags.MeteringMode ? metadata.tags.MeteringMode : null,
                Flash : metadata.tags.Flash ? metadata.tags.Flash : null,
                FocalLength : metadata.tags.FocalLength ? metadata.tags.FocalLength : null,
                SubjectArea : metadata.tags.SubjectArea ? metadata.tags.SubjectArea : null,
                SubSecTime : metadata.tags.SubSecTime ? metadata.tags.SubSecTime : null,
                SubSecTimeOriginal : metadata.tags.SubSecTimeOriginal ? metadata.tags.SubSecTimeOriginal : null,
                SubSecTimeDigitized : metadata.tags.SubSecTimeDigitized ? metadata.tags.SubSecTimeDigitized : null,
                ColorSpace : metadata.tags.ColorSpace ? metadata.tags.ColorSpace : null,
                ExifImageWidth : metadata.tags.ExifImageWidth ? metadata.tags.ExifImageWidth : null,
                ExifImageHeight : metadata.tags.ExifImageHeight ? metadata.tags.ExifImageHeight : null,
                SensingMethod : metadata.tags.SensingMethod ? metadata.tags.SensingMethod : null,
                ExposureMode : metadata.tags.ExposureMode ? metadata.tags.ExposureMode : null,
                WhiteBalance : metadata.tags.WhiteBalance ? metadata.tags.WhiteBalance : null,
                FocalLengthIn35mmFormat : metadata.tags.FocalLengthIn35mmFormat ? metadata.tags.FocalLengthIn35mmFormat : null, 
                SceneCaptureType : metadata.tags.SceneCaptureType ? metadata.tags.SceneCaptureType : null,
                LensInfo : metadata.tags.LensInfo ? metadata.tags.LensInfo : null,
                LensMake : metadata.tags.LensMake ? metadata.tags.LensMake : null,
                LensModel : metadata.tags.LensModel ? metadata.tags.LensModel : null,
            }
        };
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
  .then(imagesWithMetadata => {
    const filePath = path.join(__dirname, 'imagesWithMetadata.json');
    fs.writeFile(filePath, JSON.stringify(imagesWithMetadata), err => {
      if (err) {
        console.error('Error writing imagesWithMetadata to file:', err);
      } else {
        console.log('Successfully wrote imagesWithMetadata to file:', filePath);
      }
    });
  })
  .catch(err => console.error('Error getting images with metadata:', err));





