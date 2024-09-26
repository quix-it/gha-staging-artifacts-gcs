# CI/CD temporary artifacts storage and retrieval on staging area

Convenience GitHub Actions action used for storing and retrieving staging artifacts between jobs leveraging on stagin area.

## Inputs

| Name | Mandatory | Default | Description |
| - | - | - | - |
| name | `true` | | The name of the artifact to be stored/retrieved |
| direction | `true` | | `put` for storing data to staging area, `get` for retrieving it |
| path | `true` | | The path to the local folder/file to store as artifact or the path to the local folder to retrieve remote artifacts into |


## Outputs

The action produces no outputs.

## Usage

Upload:
```yaml
...
    - uses: quix-it/gha-staging-artifacts-gcs@v3
      with:
        name: my-artifact
        direction: put
        path: target
...
```

Download:
```yaml
...
    - uses: quix-it/gha-staging-artifacts-gcs@v3
      with:
        name: my-artifact
        direction: get
        path: target
...
```
