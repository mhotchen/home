import 'source-map-support/register'
import { APIGatewayProxyWithLambdaAuthorizerHandler, APIGatewayTokenAuthorizerHandler } from 'aws-lambda'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { Pool } from 'pg'
import { authorize } from '@boo/serverless-cognito-auth'
import { ServerlessResponse } from '@boo/serverless-responses'
import createLogger from '@boo/winston-extensions'

const pool = new Pool()
const log = createLogger()

export const organizationsAuth: APIGatewayTokenAuthorizerHandler = async event => await authorize(
  event,
  new CognitoIdentityServiceProvider(),
  process.env.USER_POOL_ID || '',
  log,
)

export const saveOrganization: APIGatewayProxyWithLambdaAuthorizerHandler<any> = async event => {
  log.info({ event: 'SaveOrganizationBegin', payload: event })

  const body = JSON.parse(event.body || '{}')
  const isValid = (body: any): body is { name: string } =>
    typeof body['name'] === 'string' && body['name'].length > 0
  if (!isValid(body)) {
    log.error({ event: 'SaveOrganizationInvalidPayload', payload: event })

    return ServerlessResponse.Cors.BadRequest()
  }

  try {
    const { rows: [ user ] } = await pool.query(
      'SELECT id, organization_id FROM users WHERE cognito_sub = $1',
      [ event.requestContext.authorizer.principalId ]
    )

    log.info({ event: 'SaveOrganizationUserFound', body, user })
    if (!user) {
      log.error({ event: 'UserNotFound', payload: event })

      return ServerlessResponse.Cors.InternalError
    }

    log.info({ event: 'SaveOrganizationUserFound', payload: event, user })
    if (user['organization_id'] !== null) {
      log.info({ event: 'SaveOrganizationUserAlreadyPartOfOrganization', payload: event, user })

      return ServerlessResponse.Cors.Conflict()
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const { rows: [ { id } ] } = await client.query(
        'INSERT INTO organizations (name) VALUES ($1) RETURNING id',
        [ body.name ]
      )
      log.info({ event: 'SaveOrganizationSaved', body, user, id })
      await client.query(
        'UPDATE users SET organization_id = $1 WHERE id = $2',
        [ id, user['id'] ]
      )
      log.info({ event: 'SaveOrganizationUserUpdated', body, user, id })
      await client.query('COMMIT')

      log.info({ event: 'SaveOrganizationComplete', payload: event, user, id })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      await client.release()
    }

    return ServerlessResponse.Cors.Created({ success: true })
  } catch (error) {
    log.error({ event: 'Error', error })
    return ServerlessResponse.Cors.InternalError
  }
}
