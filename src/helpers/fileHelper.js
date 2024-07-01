const getBase64 = (file) => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.onload = function () {
      const res = reader.result.split(",")[1];
      resolve(res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getFileExtension = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.slice(lastDotIndex + 1) : '';
} 

export { getBase64, getFileExtension };
