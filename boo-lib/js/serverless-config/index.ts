export const auth = (name: string) => ({ name, resultTtlInSeconds: 0 })

export const dbEnvironment = {
  PGHOST: '${ssm:/${self:provider.stage}/boo-db/db-host~true}',
  PGPORT: '${ssm:/${self:provider.stage}/boo-db/db-port~true}',
  PGDATABASE: '${ssm:/${self:provider.stage}/boo-db/db-name~true}',
  PGUSER: '${ssm:/${self:provider.stage}/boo-db/username~true}',
  PGPASSWORD: '${ssm:/${self:provider.stage}/boo-db/password~true}',
}

export const vpc = {
  securityGroupIds: ['${ssm:/${self:provider.stage}/boo-vpc/main-security-group~true}'],
  subnetIds: [
    '${ssm:/${self:provider.stage}/boo-vpc/lambda-subnet-a~true}',
    '${ssm:/${self:provider.stage}/boo-vpc/lambda-subnet-b~true}',
  ],
}

export const adminGetUserPermissions = {
  Effect: 'Allow',
  Action: 'cognito-idp:AdminGetUser',
  Resource: '${ssm:/${self:provider.stage}/boo-users/cognito-pool-arn~true}',
}

export const cors = {
  origin: '*',
  headers: [
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Authorization',
    'Content-Type',
    'X-Api-Key',
    'X-Amz-Date',
    'X-Amz-Security-Token',
    'X-Amz-User-Agent',
    'X-Source',
  ]
}

export const apiGateway = {
  minimumCompressionSize: 1024,
  restApiId: '${ssm:/${self:provider.stage}/boo-api/rest-api-id~true}',
  restApiRootResourceId: '${ssm:/${self:provider.stage}/boo-api/rest-api-root-resource-id~true}',
}