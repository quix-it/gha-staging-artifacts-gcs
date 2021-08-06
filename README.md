# CI/CD temporary artifacts storage and retrieval on Google Cloud Storage

Convenience GitHub Actions action used for storing and retrieving staging artifacts between jobs leveraging on Google Cloud Storage platform.

## Inputs

| Name | Mandatory | Default | Description |
| - | - | - | - |
| name | `true` | | The name of the artifact to be stored/retrieved |
| direction | `true` | | `put` for storing data to GCS, `get` for retrieving it |
| path | `true` | | The path to the local folder/file to store as artifact or the path to the local folder to retrieve remote artifacts into |

The staging bucket name is provided via the `STAGING_GCLOUD_BUCKET` environment variable.

The permissions to upload and download from such bucket are granted using a service account whose credentials are passed via the `STAGING_GCLOUD_CREDENTIALS` environment variable, a base64-encoded JSON string structured like
```json
{
  "client_email": "artifacts-sa@project_id.iam.gserviceaccount.com",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAx9jRBVZ/bXeJYPSjDUMjXAY/r7u2lKUJDzl19wuKDHTPc+NJ\nZAjrI21KMECXYVDKbsEeQ51TljK1KCKSDIU+PbAhrpNb0Wgf8uOhh/iSJ4/WaywS\nphRhj2S1aXUHc/rNSP0chO+fyIkJPO8SWYHtUy8k5xAsjYJThOK9ZY/1OAWPwHv7\nlyP1pqQ0ZyDsQf1ZHsyL9kUafm8MqWobBPYzPdb4S69fgRGLPZnhNAgUocafkSST\nW7lJHKMHm09uCeDFgIRCGkeV/jCS7SBLUrW7mJHq1XIflbLiVuDVpUoxg5w0zaNS\nL35HfaFNtPy7v418kr+U4gZVvPx8BT4k/6OSsQIDAQABAoIBAHBIu7f6D4KbxQ46\npVoQPM+5mxLLrxv5Vgu9xy/Uxe2Vu/Fq5JNWB3dSMnrF78f3sqVjz/NBc/NR7kLs\nmY57VqsmSOZjWRVhIYJAr0NMQCIGSPzSOHAjx2TfuqXT4Soi4jB+NgXi9K2hgRVB\nZdfwjj1MoblJdx7S+MYS90MXDTo5tcb/lPMF5n5f1tNCcEZgNSS1h7x5YMPKe7Tt\nykCcXoclBtQFbCieuWZS0ff2NNTJZD2wnPPKPtrX4/auLf9tpTc3XQzkXdFgBvKC\nFSxtuJp33LhvBLptbxKJWO23jXkP12z6QnFcoVj2tY0xRI5a50FOxeYP6bVtmkG7\nn7n6P6ECgYEA/omnO5OcN2ctyBi0y00MyfJiT2GgWwFSOnJtQbSbzb/NIrlEGr3W\n6zdUyd4Hvy+yfOm0hJc6oEW6USancXXSqLLHEPy0K6dAWO4l42TK9SCvX8CNSYEv\nKJl4uruoQMJKlIPLaF3vhfDoXxyCH1c8KoUcE1fPDAnpmiDvmPG1TJUCgYEAyP66\n3Bxtfo/0a135FZArMujDh5xMHFKOMJ472152S5roYTIrMcEqOzU5gaj0qYVHj9OU\nTYfcn4smn/e/vr8pisUrcMwjz6MqSluwD0Fd+AJxPUE5V1QV+p6a0cQvDSFkMw+j\n8QYcLRd6MLaa1HlXPyQxJSasXghl4cVz+31dCq0CgYEAli6J6XDynw3VyVYqdjmD\n7jOBJe0oPAnPhoS1SitSMleUpYRCVrTj9eyzrle+omN2IJWT2ReRk7cQc4knCp7G\nKJszMSao94i7Qr1gxYZW6cLbNtfZhSEfvgivXx4R7AO3FWGdxnqGNLUrpdKgQ/Wo\nnj3jjtYkZ6oBltsQA2G54vECgYEAoSpQHwrUaXV4oVb60WWGng2yK10SUmuIBEf8\n6wu1gy41Qyp9JColeNBWyjb157AtD5CyC/Dy4SMs13xKzeJupw0upgWqeWX2FSWr\n6K+bb7BVqK5SEkokTY87yROsPrUVqTPTWwJxOV7n5YOmZtTdNo4Isiducv/84an4\nNCHzpwkCgYEA8hc+MWQssZmHOip+Rp+3mfq7OeTNoEn65XGEcY5LJQy+nPrHoSIx\nPx2qNSbjrrYD75ZAjH9Xm4ETnnD6z9kO2u5TjTRQuFOkPQ9qBClLMagLuAaLeY+g\n+N/7fo094NUpvoHDCib2WCVcUS3vYCXeuG7BLSwYrQ5GACEqCMTpmdo=\n-----END RSA PRIVATE KEY-----"
}
```
which then becomes
```
ewogICJjbGllbnRfZW1haWwiOiAiYXJ0aWZhY3RzLXNhQHByb2plY3RfaWQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXG5NSUlFcFFJQkFBS0NBUUVBeDlqUkJWWi9iWGVKWVBTakRVTWpYQVkvcjd1MmxLVUpEemwxOXd1S0RIVFBjK05KXG5aQWpySTIxS01FQ1hZVkRLYnNFZVE1MVRsaksxS0NLU0RJVStQYkFocnBOYjBXZ2Y4dU9oaC9pU0o0L1dheXdTXG5waFJoajJTMWFYVUhjL3JOU1AwY2hPK2Z5SWtKUE84U1dZSHRVeThrNXhBc2pZSlRoT0s5WlkvMU9BV1B3SHY3XG5seVAxcHFRMFp5RHNRZjFaSHN5TDlrVWFmbThNcVdvYkJQWXpQZGI0UzY5ZmdSR0xQWm5oTkFnVW9jYWZrU1NUXG5XN2xKSEtNSG0wOXVDZURGZ0lSQ0drZVYvakNTN1NCTFVyVzdtSkhxMVhJZmxiTGlWdURWcFVveGc1dzB6YU5TXG5MMzVIZmFGTnRQeTd2NDE4a3IrVTRnWlZ2UHg4QlQ0ay82T1NzUUlEQVFBQkFvSUJBSEJJdTdmNkQ0S2J4UTQ2XG5wVm9RUE0rNW14TExyeHY1Vmd1OXh5L1V4ZTJWdS9GcTVKTldCM2RTTW5yRjc4ZjNzcVZqei9OQmMvTlI3a0xzXG5tWTU3VnFzbVNPWmpXUlZoSVlKQXIwTk1RQ0lHU1B6U09IQWp4MlRmdXFYVDRTb2k0akIrTmdYaTlLMmhnUlZCXG5aZGZ3amoxTW9ibEpkeDdTK01ZUzkwTVhEVG81dGNiL2xQTUY1bjVmMXROQ2NFWmdOU1MxaDd4NVlNUEtlN1R0XG55a0NjWG9jbEJ0UUZiQ2lldVdaUzBmZjJOTlRKWkQyd25QUEtQdHJYNC9hdUxmOXRwVGMzWFF6a1hkRmdCdktDXG5GU3h0dUpwMzNMaHZCTHB0YnhLSldPMjNqWGtQMTJ6NlFuRmNvVmoydFkweFJJNWE1MEZPeGVZUDZiVnRta0c3XG5uN242UDZFQ2dZRUEvb21uTzVPY04yY3R5QmkweTAwTXlmSmlUMkdnV3dGU09uSnRRYlNiemIvTklybEVHcjNXXG42emRVeWQ0SHZ5K3lmT20waEpjNm9FVzZVU2FuY1hYU3FMTEhFUHkwSzZkQVdPNGw0MlRLOVNDdlg4Q05TWUV2XG5LSmw0dXJ1b1FNSktsSVBMYUYzdmhmRG9YeHlDSDFjOEtvVWNFMWZQREFucG1pRHZtUEcxVEpVQ2dZRUF5UDY2XG4zQnh0Zm8vMGExMzVGWkFyTXVqRGg1eE1IRktPTUo0NzIxNTJTNXJvWVRJck1jRXFPelU1Z2FqMHFZVkhqOU9VXG5UWWZjbjRzbW4vZS92cjhwaXNVcmNNd2p6Nk1xU2x1d0QwRmQrQUp4UFVFNVYxUVYrcDZhMGNRdkRTRmtNdytqXG44UVljTFJkNk1MYWExSGxYUHlReEpTYXNYZ2hsNGNWeiszMWRDcTBDZ1lFQWxpNko2WER5bnczVnlWWXFkam1EXG43ak9CSmUwb1BBblBob1MxU2l0U01sZVVwWVJDVnJUajlleXpybGUrb21OMklKV1QyUmVSazdjUWM0a25DcDdHXG5LSnN6TVNhbzk0aTdRcjFneFlaVzZjTGJOdGZaaFNFZnZnaXZYeDRSN0FPM0ZXR2R4bnFHTkxVcnBkS2dRL1dvXG5uajNqanRZa1o2b0JsdHNRQTJHNTR2RUNnWUVBb1NwUUh3clVhWFY0b1ZiNjBXV0duZzJ5SzEwU1VtdUlCRWY4XG42d3UxZ3k0MVF5cDlKQ29sZU5CV3lqYjE1N0F0RDVDeUMvRHk0U01zMTN4S3plSnVwdzB1cGdXcWVXWDJGU1dyXG42SytiYjdCVnFLNVNFa29rVFk4N3lST3NQclVWcVRQVFd3SnhPVjduNVlPbVp0VGRObzRJc2lkdWN2Lzg0YW40XG5OQ0h6cHdrQ2dZRUE4aGMrTVdRc3NabUhPaXArUnArM21mcTdPZVROb0VuNjVYR0VjWTVMSlF5K25QckhvU0l4XG5QeDJxTlNianJyWUQ3NVpBakg5WG00RVRubkQ2ejlrTzJ1NVRqVFJRdUZPa1BROXFCQ2xMTWFnTHVBYUxlWStnXG4rTi83Zm8wOTROVXB2b0hEQ2liMldDVmNVUzN2WUNYZXVHN0JMU3dZclE1R0FDRXFDTVRwbWRvPVxuLS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS0iCn0K
```

The STAGING_GCLOUD_CREDENTIALS` environment variable may be omitted if the workflow runs on a runner that's been granted a service account identity with proper permissions (i.e. if the runner is executing on a GCE instance with a proper service account).

The project ID the bucket belongs to can be provided via the `STAGING_GCLOUD_PROJECT` environment variable, but as long as the bucket belongs to the same project as the service account there's no need to do so.

The environment variables can be provided at step, job, workflow or runner levels.


## Outputs

The action produces no outputs.

## Usage

Upload:
```yaml
...
    - uses: quix-it/gha-staging-artifacts-gcs@v1
      env:
        STAGING_GCLOUD_BUCKET: ${{ secrets.STAGING_GCLOUD_BUCKET }}
        STAGING_GCLOUD_CREDENTIALS: ${{ secrets.STAGING_GCLOUD_CREDENTIALS }}
      with:
        name: my-artifact
        direction: put
        path: target
...
```

Download:
```yaml
...
    - uses: quix-it/gha-staging-artifacts-gcs@v1
      env:
        STAGING_GCLOUD_BUCKET: ${{ secrets.STAGING_GCLOUD_BUCKET }}
        STAGING_GCLOUD_CREDENTIALS: ${{ secrets.STAGING_GCLOUD_CREDENTIALS }}
      with:
        name: my-artifact
        direction: get
        path: target
...
```
