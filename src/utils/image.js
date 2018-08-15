function getFullImagePath(imageName) {
  return `./media/${imageName}`;
}

function getFullImageURL(imageName) {
  return `/media/${imageName}`;
}

export {
  getFullImagePath,
  getFullImageURL,
};
