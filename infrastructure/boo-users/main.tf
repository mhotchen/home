variable env {type = string}

resource aws_cognito_user_pool boo-users {
  name = "boo-users-${var.env}"
  password_policy {
    minimum_length = 8
    require_lowercase = false
    require_numbers = false
    require_symbols = false
    require_uppercase = false
    temporary_password_validity_days = 7
  }
}

resource aws_cognito_user_pool_client boo-users-web {
  name = "web-${var.env}"
  user_pool_id = aws_cognito_user_pool.boo-users.id
  refresh_token_validity = 30

  explicit_auth_flows = ["USER_PASSWORD_AUTH"]

  callback_urls = ["oauth2://callback"]
  logout_urls = ["oauth2://sign-out"]
}

resource aws_ssm_parameter boo-users-cognito-pool-arn {
  name = "/${var.env}/boo-users/cognito-pool-arn"
  type = "SecureString"
  value = aws_cognito_user_pool.boo-users.arn
}

resource aws_ssm_parameter boo-users-cognito-pool-id {
  name = "/${var.env}/boo-users/cognito-pool-id"
  type = "SecureString"
  value = aws_cognito_user_pool.boo-users.id
}

resource aws_ssm_parameter boo-users-cognito-pool-name {
  name = "/${var.env}/boo-users/cognito-pool-name"
  type = "SecureString"
  value = aws_cognito_user_pool.boo-users.name
}

resource aws_ssm_parameter boo-users-web-client-id {
  name = "/${var.env}/boo-users/cognito-client-web-id"
  type = "SecureString"
  value = aws_cognito_user_pool_client.boo-users-web.id
}