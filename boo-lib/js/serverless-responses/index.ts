import { APIGatewayProxyResult } from 'aws-lambda'

export namespace ServerlessResponse {
  const headers = {
    'Strict-Transport-Security': 'max-age=7776000',
    'Content-Security-Policy': 'default-src https:',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'deny',
    'X-XSS-Protection': '1',
  }

  export const OK = (body: any): APIGatewayProxyResult => ({
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  })

  export const Created = (body: any): APIGatewayProxyResult => ({
    statusCode: 201,
    headers,
    body: JSON.stringify(body),
  })

  export const BadRequest = (body: any = { success: false, errorMessage: 'Bad request' }): APIGatewayProxyResult => ({
    statusCode: 400,
    headers,
    body: JSON.stringify(body),
  })

  export const Unauthorized: APIGatewayProxyResult = {
    statusCode: 401,
    headers,
    body: JSON.stringify({ success: false, errorMessage: 'Unauthorized' }),
  }

  export const NotFound: APIGatewayProxyResult = {
    statusCode: 404,
    headers,
    body: JSON.stringify({ success: false, errorMessage: 'Not found' }),
  }

  export const ImATeaPot: APIGatewayProxyResult = {
    statusCode: 418,
    headers,
    body: JSON.stringify({ success: true, errorMessage: "I'm a teapot" }),
  }

  export const InternalError: APIGatewayProxyResult = {
    statusCode: 500,
    headers,
    body: JSON.stringify({ success: false, errorMessage: 'Internal error' }),
  }

  export namespace Cors {
    const corsHeaders = {
      ...headers,
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    }

    export const OK = (body: any): APIGatewayProxyResult => ({
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(body),
    })

    export const Created = (body: any): APIGatewayProxyResult => ({
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(body),
    })

    export const BadRequest = (body: any = { success: false, errorMessage: 'Bad request' }): APIGatewayProxyResult => ({
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify(body),
    })

    export const Unauthorized: APIGatewayProxyResult = {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, errorMessage: 'Unauthorized' }),
    }

    export const NotFound: APIGatewayProxyResult = {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, errorMessage: 'Not found' }),
    }

    export const Conflict = (body: any = { success: false, errorMessage: 'Conflict' }): APIGatewayProxyResult => ({
      statusCode: 409,
      headers: corsHeaders,
      body: JSON.stringify(body),
    })

    export const ImATeaPot: APIGatewayProxyResult = {
      statusCode: 418,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, errorMessage: "I'm a teapot" }),
    }

    export const InternalError: APIGatewayProxyResult = {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, errorMessage: 'Internal error' }),
    }
  }
}
