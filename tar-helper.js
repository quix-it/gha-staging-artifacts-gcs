const tar = require('tar-stream')
const glob = require("glob");
const fs = require('fs');
const path = require('path')

module.exports.pack = function (directory) {
  const pack = tar.pack()
  glob(path.join(directory,'**','*'), { nodir: true }, function (err, res) {
    if (err) {
      throw err
    } else {
      res.forEach((file) => {
        const data = fs.readFileSync(file)
        pack.entry({ name: path.relative(directory, file) }, data).end()
      })
      pack.finalize()
    }
  })
  return pack
}

module.exports.extract = function (directory) {
  const extract = tar.extract()
  extract.on('entry', (header, stream, next) => {
    stream.on('end', () => {
      next()
    })
    if (header.type == 'file') {
      const destination = path.join(directory, header.name)
      fs.mkdir(path.dirname(destination), { recursive: true }, () => {
        stream.pipe(fs.createWriteStream(destination))
      })
    } else {
      stream.resume()
    }
  })
  extract.on('finish', () => {
    // nothing left to do
  })
  return extract
}
