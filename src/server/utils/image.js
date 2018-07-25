import fs from 'fs-extra';
import imageType from 'image-type';

const DATA_URL_REGEX = /^data:.+\/(.+);base64,(.*)$/;

async function saveDataUrlImageToFile(dataUrl, imageName) {
  const matches = dataUrl.match(DATA_URL_REGEX);
  if (matches && matches.length === 3) {
    const buffer = Buffer.from(matches[2], 'base64');
    const type = imageType(buffer);
    if (type) {
      await fs.ensureDir('./media');
      return fs.writeFile(`./media/${imageName}.${type.ext}`, buffer);
    }
    throw new Error('data url was not and image');
  }
  throw new Error('data url did not match regex');
}

function getFullImagePath(imageName) {
  return `./media/${imageName}`;
}

function getFullImageURL(imageName) {
  return `/media/${imageName}`;
}

export {
  saveDataUrlImageToFile,
  getFullImagePath,
  getFullImageURL,
};
