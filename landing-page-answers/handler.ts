import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import uuidV4 from 'uuid/v4'
import 'source-map-support/register'

export const storeAnswers: APIGatewayProxyHandler = async event => {
    log.info({ event: 'StoreAnswersBegin', payload: event })
    try {
        const item = { ...JSON.parse(event.body), id: uuidV4() }
        log.info({ event: 'StoreAnswersItemCreated', item })

        const docClient = new DynamoDB.DocumentClient()
        const result = await docClient
            .put({ TableName: 'landing-page-answers', Item: item })
            .promise()

        log.info({ event: 'StoreAnswersItemSaved', result, item })

        return {
            statusCode: 201,
            body: JSON.stringify({ success: true }),
        }
    } catch (error) {
        log.error(error)

        return {
            statusCode: 500,
            body: JSON.stringify({ success: false }),
        }
    }
}

const log = {
    info (payload: any) {
        console.log(JSON.stringify(payload))
    },
    error (payload: Error) {
        const error = {}

        Object.getOwnPropertyNames(payload).forEach(function (key) {
            error[key] = payload[key]
        })

        console.log(JSON.stringify(error))
    }
}