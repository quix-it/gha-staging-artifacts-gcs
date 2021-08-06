module.exports = function(storage_options = {}) {
  const module = {}
  
  const {Storage} = require('@google-cloud/storage');
  const storage = new Storage(storage_options);

  module.file = function (bucket, bucket_path) {
    try {
      return storage.bucket(bucket).file(bucket_path)
    } catch(err) {
      throw Error("Bucket object not found")
    }
  }

  return module
}
