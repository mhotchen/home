import type { AWS } from '@serverless/typescript'
import { adminGetUserPermissions, apiGateway, vpc, dbEnvironment, auth, cors } from '@boo/serverless-config'

const serverlessConfiguration: AWS = {
  service: 'boo-users',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: [ 'serverless-webpack' ],
  provider: {
    name: 'aws',
    // @ts-ignore
    region: '${opt:region, "eu-west-2"}',
    stage: '${opt:stage, "dev"}',
    profile: '${opt:profile, "personal"}',
    runtime: 'nodejs12.x',
    versionFunctions: false,
    apiGateway,
    vpc,
    iamRoleStatements: [ adminGetUserPermissions ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      USER_POOL_ID: '${ssm:/${self:provider.stage}/boo-users/cognito-pool-id~true}',
      ...dbEnvironment,
    },
  },
  functions: {
    usersAuth: {
      handler: 'handler.usersAuth',
    },
    autoVerify: {
      handler: 'handler.autoVerify',
      events: [
        {
          cognitoUserPool: {
            pool: '${ssm:/${self:provider.stage}/boo-users/cognito-pool-name~true}',
            trigger: 'PreSignUp',
            existing: true,
          }
        }
      ]
    },
    saveUser: {
      handler: 'handler.saveUser',
      events: [
        {
          cognitoUserPool: {
            pool: '${ssm:/${self:provider.stage}/boo-users/cognito-pool-name~true}',
            trigger: 'PostConfirmation',
            existing: true,
          }
        }
      ]
    },
    getUser: {
      handler: 'handler.getUser',
      events: [
        {
          http: {
            method: 'get',
            path: '/users/me',
            private: true,
            authorizer: auth('usersAuth'),
            cors,
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration
