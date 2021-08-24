const { test, expect } = require('@jest/globals');
const tar = require('./tar-helper.js');
const stream = require('stream')
const util = require('util')
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs');
const path = require('path');
const glob = require("glob");
const crypto = require('crypto');

const source = "./.test/source";
const destination = "./.test/destination";

jest.setTimeout(10_000)

const compareFolders = (a, b) => {
  return new Promise((resolve, reject) => {
    glob(path.join(a,'**','*'), { nodir: true }, function (err, files) {
      if (err) {
        reject(err)
      } else {
        Promise.all(
          files.map( file => {
            const relpath = path.relative(a, file)

            const a_data = fs.readFileSync(path.join(a, relpath))
            const a_hash = crypto.createHash('md5').update(a_data).digest("hex")

            const b_data = fs.readFileSync(path.join(b, relpath))
            const b_hash = crypto.createHash('md5').update(b_data).digest("hex")

            return new Promise((iresolve, ireject) => {
              if (a_hash !== b_hash) {
                const error = new Error(`Source and destination md5 sums differ for file '${relpath}'`)
                ireject(error)
              } else {
                iresolve([a_hash, b_hash])
              }
            })

          })
        )
        .then(resolve).catch(reject)
      }
    })
  })
}

test('filecount', async () => {
  glob(path.join(source,'**','*'), { nodir: true }, function (err, files) {
    expect(err).toBeNull()
    expect(files.length).toBeGreaterThan(0)
  })
})

test('tar', async () => {

  await pipeline(
    tar.pack(source),
    tar.extract(destination)
  )

  const okstatus = "All files have been packed and extracted correctly"
  
  var status
  try {
    await compareFolders(source, destination)
    status = okstatus
  } catch(err) {
    status = err.message
  }
  expect(status).toBe(okstatus)

});
