import { SNSHandler } from 'aws-lambda'
import { CodeCommit, S3 } from 'aws-sdk'
import { contentType } from 'mime-types'

interface CommitRef {
  readonly commit: string,
  readonly ref: string
}

export const build: SNSHandler = async event => {
  const commitRef: CommitRef = JSON.parse(event.Records[0].Sns.Message).Records[0].codecommit.references[0]
  if (commitRef.ref !== 'refs/heads/master') {
    return
  }

  const repositoryName = 'Services'
  const codeCommit = new CodeCommit
  const s3 = new S3

  const folder = await (codeCommit
    .getFolder({
      repositoryName,
      folderPath: '/mhn.me/public',
      commitSpecifier: commitRef.commit,
    })
    .promise()
  )

  await Promise.all(folder.files
      .map(async ({ blobId, relativePath }) =>
          s3.putObject({
              Bucket: 'mhn-me',
              Key: relativePath,
              ContentType: contentType(relativePath) || 'application/octet',
              Body: (await codeCommit.getBlob({ repositoryName, blobId }).promise()).content,
              CacheControl: 'max-age=3155760000', // 100 years
          })
              .promise()
      ))
}
