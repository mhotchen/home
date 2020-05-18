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
        generateSite('landing-demo.mhn.me/public', 'landing-demo-mhn-me', commitRef),
        generateSite('mhn.me/public', 'mhn-me', commitRef),
        generateSite('rtw.mhn.me/public', 'rtw-mhn-me', commitRef),
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
                folderPath: '/' + folderPath,
                commitSpecifier: commitRef.commit,
            })
            .promise()
        )

        await Promise.all(folder.subFolders
            .map(subFolder => uploadContents(subFolder.absolutePath))
        )

        await Promise.all(folder.files
            .map(async ({ blobId, absolutePath }) => {
                console.log(absolutePath, sourceDir, absolutePath.replace(sourceDir, ''))

                    return s3
                        .putObject({
                            Bucket: targetBucket,
                            Key: absolutePath.replace(sourceDir, ''),
                            Body: 'ttt',//(await codeCommit.getBlob({ repositoryName, blobId }).promise()).content,
                            CacheControl: 'max-age=3155760000', // 100 years
                        })
                        .promise()
                }
            )
        )
    }

    await uploadContents(sourceDir)
}

