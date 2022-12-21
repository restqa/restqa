function clean(obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] !== undefined) result[key] = obj[key];
    return result;
  }, {});
}

function getContentType(headerContentType) {
  if (!headerContentType) return undefined;
  return String(headerContentType.split("/").pop()).split(";").shift();
}

module.exports = {
  getContentType,
  clean
};
