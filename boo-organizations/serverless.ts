import type { AWS } from '@serverless/typescript'
import { auth, adminGetUserPermissions, apiGateway, dbEnvironment, cors, vpc } from '@boo/serverless-config'

const serverlessConfiguration: AWS = {
  service: 'boo-organizations',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  // Add the serverless-webpack plugin
  plugins: [ 'serverless-webpack' ],
  provider: {
    name: 'aws',
    // @ts-ignore
    region: '${opt:region, "eu-west-2"}',
    stage: '${opt:stage, "dev"}',
    profile: '${opt:profile, "personal"}',
    runtime: 'nodejs12.x',
    versionFunctions: false,
    apiKeys: [ 'boo-${self:provider.stage}' ],
    apiGateway,
    iamRoleStatements: [ adminGetUserPermissions ],
    vpc,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      USER_POOL_ID: '${ssm:/${self:provider.stage}/boo-users/cognito-pool-id~true}',
      ...dbEnvironment,
    },
  },
  functions: {
    organizationsAuth: {
      handler: 'handler.organizationsAuth',
    },
    saveOrganization: {
      handler: 'handler.saveOrganization',
      events: [
        {
          http: {
            method: 'post',
            path: '/organizations',
            private: true,
            authorizer: auth('organizationsAuth'),
            cors,
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration
