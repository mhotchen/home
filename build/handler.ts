import { SNSHandler } from 'aws-lambda'
import { CodeCommit, S3 } from 'aws-sdk'
import { lookup } from 'mime-types'

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
        // The trailing slash is important, otherwise S3 gets very confused and fucked up.
        generateSite('landing-demo.mhn.me/public/', 'landing-demo-mhn-me', commitRef),
        generateSite('mhn.me/public/', 'mhn-me', commitRef),
        generateSite('rtw.mhn.me/public/', 'rtw-mhn-me', commitRef),
    ])
}

const generateSite = async (sourceDir: string, targetBucket: string, commitRef: CommitRef) => {
    const repositoryName = 'Services'
    const codeCommit = new CodeCommit
    const s3 = new S3

    const uploadContents = async folderPath => {
        const folder = await (codeCommit
            .getFolder({
                repositoryName,
                folderPath,
                commitSpecifier: commitRef.commit,
            })
            .promise()
        )

        await Promise.all(folder.subFolders
            .map(subFolder => uploadContents(subFolder.absolutePath))
        )

        await Promise.all(folder.files
            .map(async ({ blobId, absolutePath }) =>
                s3
                    .putObject({
                        Bucket: targetBucket,
                        Key: absolutePath.replace(sourceDir, ''),
                        Body: (await codeCommit.getBlob({ repositoryName, blobId }).promise()).content,
                        ContentType: lookup(absolutePath),
                        CacheControl: 'max-age=3155760000', // 100 years
                    })
                    .promise()
            )
        )
    }

    await uploadContents(sourceDir)
}

