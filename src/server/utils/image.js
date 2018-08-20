import fs from 'fs-extra';
import imageType from 'image-type';
import config from '../../../config';

const DATA_URL_REGEX = /^data:.+\/(.+);base64,(.*)$/;

function generateImageName(imageName) {
  let name = String(imageName);
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex !== -1) {
    name = name.slice(0, dotIndex);
  }
  const slug = name
    .normalize('NFKD')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '-');
  return `${Date.now()}-${slug}`;
}

async function saveDataUrlImageToFile(dataUrl, imageName) {
  const newImageName = generateImageName(imageName);
  const matches = dataUrl.match(DATA_URL_REGEX);
  if (matches && matches.length === 3) {
    const buffer = Buffer.from(matches[2], 'base64');
    const type = imageType(buffer);
    if (type) {
      await fs.ensureDir(config.MEDIA_PATH);
      await fs.writeFile(`${config.MEDIA_PATH}${newImageName}.${type.ext}`, buffer);
      return `${newImageName}.${type.ext}`;
    }
    throw new Error('data url was not and image');
  }
  throw new Error('data url did not match regex');
}

function getFullImagePath(imageName) {
  return `${config.MEDIA_PATH}${imageName}`;
}

function getFullImageURL(imageName) {
  if (fs.existsSync(getFullImagePath(imageName))) {
    return `${config.MEDIA_URL}${imageName}`;
  }
  return 'https://danesjenovdan.si/img/djndog.png';
}

export {
  saveDataUrlImageToFile,
  getFullImagePath,
  getFullImageURL,
};
