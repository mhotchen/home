import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import { CognitoIdentityServiceProvider } from 'aws-sdk'

type Effect = 'Allow' | 'Deny'

export async function authorize (
  event: APIGatewayTokenAuthorizerEvent,
  cognito: CognitoIdentityServiceProvider,
  poolId: string,
  log: { info: (data: any) => void, error: (data: any) => void }
): Promise<APIGatewayAuthorizerResult> {
  log.info({ name: 'AuthorizeBegin', event })
  if (!event.authorizationToken) {
    log.info({ name: 'NoAuthToken', event })
    throw new Error('Unauthorized')
  }

  try {
    const accessToken = event.authorizationToken.replace(/bearer /i, '')

    const cognitoUser = await cognito
      .getUser({ AccessToken: accessToken })
      .promise()

    const username = cognitoUser.Username
    const sub = cognitoUser.UserAttributes.filter(attr => attr.Name === 'sub')[0].Value

    let effect: Effect = 'Allow'

    const adminCognitoUserSub = (await cognito.adminGetUser({ UserPoolId: poolId, Username: username }).promise())
      ?.UserAttributes
      ?.find(attr => attr.Name === 'sub')
      ?.Value

    if (sub === undefined) {
      throw new Error('Unknown sub')
    }

    if (sub !== adminCognitoUserSub) {
      effect = 'Deny'
    }

    const policy = generatePolicy(sub, event.methodArn, effect)
    log.info({ name: 'PolicyGenerated', event, policy })

    return policy
  } catch (error) {
    log.error({ name: 'Error', error })
    throw error
  }
}

const generatePolicy = (principalId: string, resource: string, effect: Effect): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: effect,
        Action: 'execute-api:Invoke',
        Resource: resource,
      }
    ]
  }
})