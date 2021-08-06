const core = require('@actions/core')
const github = require('@actions/github')
const artifacts = require('./artifacts.js')

async function run() {
  try {
    const inputs = {}
    inputs.project_id = process.env.STAGING_GCLOUD_PROJECT
    inputs.bucket = process.env.STAGING_GCLOUD_BUCKET
    inputs.bucket_path = 'artifacts/'
    inputs.name = core.getInput('name')
    inputs.path = core.getInput('path')
    inputs.direction = core.getInput('direction').toLowerCase()
    inputs.credentials = process.env.STAGING_GCLOUD_CREDENTIALS

    const outputs = await artifacts.handleArtifacts(github.context, inputs)
    console.log(outputs)

  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  }
}

run()
