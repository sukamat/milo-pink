function getFloodgateUrl(url) {
  if (!url) {
    return undefined;
  }
  let urlArr = url.split('--');
  urlArr[1] += '-pink';
  return urlArr.join('--');
}

export {
  getFloodgateUrl,
}
