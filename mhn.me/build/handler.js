var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CodeCommit, S3 } from 'aws-sdk';
import { contentType } from 'mime-types';
export const build = (event, context) => __awaiter(this, void 0, void 0, function* () {
    const commitRef = JSON.parse(event.Records[0].Sns.Message).Records[0].codecommit.references[0];
    if (commitRef.ref !== 'refs/heads/master') {
        return;
    }
    const repositoryName = 'Services';
    const codeCommit = new CodeCommit;
    const s3 = new S3;
    const folder = codeCommit
        .getFolder({
        repositoryName,
        folderPath: '/mhn.me/public',
        commitSpecifier: commitRef.commit,
    })
        .promise();
    const fileUploads = (yield folder).files
        .map(({ blobId, relativePath }) => __awaiter(this, void 0, void 0, function* () {
        return s3.putObject({
            Bucket: 'mhn-me',
            Key: relativePath,
            ContentType: contentType(relativePath) || 'application/octet',
            Body: (yield codeCommit.getBlob({ repositoryName, blobId }).promise()).content,
        })
            .promise();
    }));
    yield Promise.all(fileUploads);
});
//# sourceMappingURL=handler.js.map