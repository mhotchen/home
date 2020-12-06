import 'source-map-support/register'
import {
  PostConfirmationTriggerHandler,
  PreSignUpTriggerHandler,
  APIGatewayProxyWithLambdaAuthorizerHandler,
  APIGatewayTokenAuthorizerHandler,
} from 'aws-lambda'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { Pool } from 'pg'
import { ServerlessResponse } from '@boo/serverless-responses'
import createLogger from '@boo/winston-extensions'
import { authorize } from '@boo/serverless-cognito-auth'

const pool = new Pool()
const log = createLogger()

export const usersAuth: APIGatewayTokenAuthorizerHandler = async event => await authorize(
  event,
  new CognitoIdentityServiceProvider(),
  process.env.USER_POOL_ID || '',
  log,
)

export const autoVerify: PreSignUpTriggerHandler = async event => {
  event.response.autoConfirmUser = true
  event.response.autoVerifyEmail = true

  return event
}

export const saveUser: PostConfirmationTriggerHandler = async event => {
  log.info({ event: 'SaveUserBegin', payload: event })
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    log.info({ event: 'SaveUserNotConfirmSignUpIgnore', payload: event })
    return
  }

  const user = await new CognitoIdentityServiceProvider()
    .adminGetUser({
      Username: event.userName,
      UserPoolId: event.userPoolId,
    })
    .promise()

  const sub = user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value
  const email = user?.UserAttributes?.find(attr => attr.Name === 'email')?.Value
  if (sub === undefined || email === undefined) {
    log.error({ event: 'SaveUserDetailsNotFoundInCognito', payload: event })
    return
  }

  await pool.query('INSERT INTO users (cognito_sub, email) VALUES ($1, $2)', [sub, email])

  return event
}

export const getUser: APIGatewayProxyWithLambdaAuthorizerHandler<any> = async event => {
  log.info({ event: 'GetUserBegin', payload: event })

  try {
    const { rows: [ user ] } = await pool.query(
      'SELECT id, email FROM users WHERE cognito_sub = $1',
      [ event.requestContext.authorizer.principalId ]
    )

    log.info({ event: 'GetUserUserFound', user })
    if (!user) {
      log.error({ event: 'UserNotFound', payload: event })

      return ServerlessResponse.Cors.NotFound
    }

    return ServerlessResponse.Cors.OK({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.email.split('@')[0],
      }
    })
  } catch (error) {
    log.error({ event: 'Error', error })
    return ServerlessResponse.Cors.InternalError
  }
}