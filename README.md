
## Usage
To include the action in a workflow in another repository, you can use the
`uses` syntax with the `@` symbol to reference a specific branch, tag, or commit
hash.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v3

  - name: Gradle properties diff checker
    id: gradle-diff
    uses: victor-teles/gradle-properties-diff-checker@v1
    with:
      file-name: ./gradle.properties
      property: version

  - name: Print Output
    id: output
    run: echo "${{ steps.gradle-diff.outputs.changed }}"
```

Based on https://github.com/EndBug/version-check
