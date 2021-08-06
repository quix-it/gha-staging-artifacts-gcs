module.exports.handleArtifacts = function (context, inputs) {
    const storage_options = {}

    if (inputs.project_id) storage_options.projectId = inputs.project_id
    if (inputs.credentials) storage_options.credentials = JSON.parse(Buffer.from(inputs.credentials, 'base64'))
    
    const { pipeline } = require('stream')
    const gcs = require('./gcs-helper.js')(storage_options)
    const tar = require('./tar-helper.js')
    const crypto = require('crypto')
      
    return new Promise((resolve, reject) => {
      // pre-flight checks
      const errors = []
  
      if (!inputs.bucket) errors.push("bucket is undefined")
      if (!inputs.bucket_path) errors.push("bucket_path is undefined")
      if (!inputs.path) errors.push("path is undefined")
      if (!['get','put'].includes(inputs.direction)) errors.push("direction needs to be either 'get' or 'put'")
      
      if (errors.length > 0) reject(errors)
      
      const hashedkey = crypto.createHash('md5').update(inputs.name).digest("hex")
      inputs.bucket_path = [inputs.bucket_path, context.runId, hashedkey + '.tar'].join('/').replace(/\/+/,'/')

      const file = gcs.file(inputs.bucket, inputs.bucket_path)
      
      if (inputs.direction == 'get') {
        // download tarball and extract to path

        pipeline(
          file.createReadStream(),
          tar.extract(inputs.path),
          (err) => {
            if (err)
              reject(Error(`Error fetching artifact "${inputs.name}": ${err.message}`))
            else
              resolve(`Artifact downloaded successfully`)
          }
        )
  
      } else if (inputs.direction == 'put') {
        // pack path and upload tarball

        pipeline(
          tar.pack(inputs.path),
          file.createWriteStream(),
          (err) => {
            if (err)
              reject(Error(`Error saving artifact "${inputs.name}": ${err.message}`))
            else {
              file.setMetadata({
                metadata: {
                  name: inputs.name
                }
              }).then(resolve(`Artifact uploaded successfully`))
                .catch(resolve(`Artifact uploaded successfully (metadata update failed)`))
            }
          }
        )

      }
  
    })
  }
