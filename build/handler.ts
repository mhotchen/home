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

    await Promise.all([
        generateSite('/landing-demo.mhn.me/public', 'landing-demo-mhn-me', commitRef),
        generateSite('/mhn.me/public', 'mhn-me', commitRef),
    ])
}

const generateSite = async (sourceDir: string, targetBucket: string, commitRef: CommitRef) => {
    const repositoryName = 'Services'
    const codeCommit = new CodeCommit
    const s3 = new S3

    const folder = codeCommit
        .getFolder({
            repositoryName,
            folderPath: sourceDir,
            commitSpecifier: commitRef.commit,
        })
        .promise()

    const fileUploads = (await folder).files
        .map(async ({ blobId, relativePath }) =>
            s3.putObject({
                Bucket: targetBucket,
                Key: relativePath,
                ContentType: contentType(relativePath) || 'application/octet',
                Body: (await codeCommit.getBlob({ repositoryName, blobId }).promise()).content,
                CacheControl: 'max-age=3155760000', // 100 years
            })
                .promise()
        )

    await Promise.all(fileUploads)
}

