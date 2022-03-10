import fs from 'fs-extra';
// import multer from 'multer';
import imagemin from 'imagemin';
import imageminMozJpeg from 'imagemin-mozjpeg';
import imageminPngQuant from 'imagemin-pngquant';

function generateImageName(imageName, mimeType) {
  let name = String(imageName);
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex !== -1) {
    name = name.slice(0, dotIndex);
  }
  let slug = name
    .normalize('NFKD')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '-');
  if (mimeType === 'image/jpeg') {
    slug += '.jpg';
  } else if (mimeType === 'image/png') {
    slug += '.png';
  } else {
    slug += '.unknown';
  }
  return `${Date.now()}-${slug}`;
}

function getFullImagePath(imageName) {
  if (
    typeof imageName !== 'string' ||
    !imageName.trim() ||
    imageName.indexOf('.') === -1
  ) {
    return `${process.env.MEDIA_PATH}DOES_NOT_EXIST`;
  }
  return `${process.env.MEDIA_PATH}${imageName}`;
}

function getFullImageURL(imageName) {
  if (fs.existsSync(getFullImagePath(imageName))) {
    return `${process.env.MEDIA_URL}${imageName}`;
  }
  return 'https://danesjenovdan.si/img/djndog.png';
}

// const imageUploader = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       fs.ensureDir(process.env.MEDIA_PATH).then(() => {
//         cb(null, process.env.MEDIA_PATH);
//       });
//     },
//     filename(req, file, cb) {
//       cb(null, generateImageName(file.originalname, file.mimetype));
//     },
//   }),
//   fileFilter(req, file, cb) {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//       return cb(null, true);
//     }
//     return cb(
//       new Error(`Only 'png' and 'jpeg' images allowed (got ${file.mimetype}).`)
//     );
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 2MB
//   },
// });

function optimizeImage(fileName) {
  return imagemin([fileName], {
    glob: false, // not needed, doesn't work on windows anyway
    destination: process.env.MEDIA_PATH,
    plugins: [
      imageminMozJpeg({ quality: 90 }),
      imageminPngQuant({ quality: [0.9, 1] }),
    ],
  });
}

export {
  getFullImagePath,
  getFullImageURL,
  /* imageUploader, */ optimizeImage,
};
