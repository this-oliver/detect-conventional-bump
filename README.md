# README

[![CI/CD](https://github.com/this-oliver/detect-conventional-bump/actions/workflows/cicd.yaml/badge.svg)](https://github.com/this-oliver/detect-conventional-bump/actions/workflows/cicd.yaml)

`detect-conventional-bump` is a GitHub Action that uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard to determine the type of version bump (`major`, `minor`, `patch`) based on the given [input parameters](#input-parameters). It is designed to be used in CI/CD pipelines to automate versioning and release processes.

The following commit message format is used to determine the bump type ([source](https://github.com/angular/angular/blob/9228a733631a7d3ba79456c7b2da6e6ff239d4cb/contributing-docs/commit-message-guidelines.md#commit-message-header)):

```md
<type>(<scope?>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: optional. The scope may be anything specifying the place of the commit change.
  │
  └─⫸ Commit Type: major|breaking|minor|feat|ft|patch|fix|chore|docs
```

By default, the action uses the following commit types to determine the bump type:

- Major: `major`, `breaking`, `release`
- Minor: `minor`, `feat`, `ft`
- Patch: `patch`, `fix`, `chore`, `docs`

## Usage

```yaml
name: CI/CD
on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write # needs write permission to push tag and release
    steps:
      - uses: actions/checkout@v4

      - name: Detect bump type
        id: bump
        uses: this-oliver/detect-conventional-bump@v0.1.3
        with:
          message: ${{ github.event.head_commit.message }} # 'feat(core): adds new feature'

      - name: Bump version and push tag
        id: tag
        uses: mathieudutour/github-tag-action@a22cf08638b34d5badda920f9daf6e72c477b07b # v6.2
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          default_bump: ${{ steps.bump.outputs.type }} # bump type should be 'minor'

      - name: Create a GitHub release
        uses: ncipollo/release-action@440c8c1cb0ed28b9f43e4d1d670870f059653174 # v1.16.0
        with:
          tag: ${{ steps.tag.outputs.new_tag }}
          name: ${{ steps.tag.outputs.new_tag }}
          body: ${{ steps.tag.outputs.changelog }}
```

### Input Parameters

| Parameter | Default | Required | Description |
| --------- | ----------- | ------- | -------- |
| `message` | `""` | Yes | The commit message to check. If not provided, the action will use the latest commit message. |
| `keywords-major` | `major,breaking,release` | No | Comma-separated list of keywords that indicate a major version bump. |
| `keywords-minor` | `minor,feat,ft` | No | Comma-separated list of keywords that indicate a minor version bump. |
| `keywords-patch` | `patch,fix,chore,docs` | No | Comma-separated list of keywords that indicate a patch version bump. |

### Output Parameters

| Parameter | Description |
| --------- | ----------- |
| `type` | The bump type (`major`, `minor`, `patch`) based on the commit message. |
