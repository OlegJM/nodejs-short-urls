module.exports.isValidUrl = function (url) {
  const urlRegExp = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+(\.[a-zA-Z]{2,5}){0,1}[\.]{0,1}([:][0-9]{2,5}){0,1}/;
  return urlRegExp.test(url);
};
