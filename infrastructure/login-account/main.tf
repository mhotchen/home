variable "name" {
  type = string
}

variable "pgp-key" {
  type = string
}

variable "group" {
  type = string
}

resource "aws_iam_user" "user" {
  name          = var.name
  path          = "/"
  force_destroy = true
}

resource "aws_iam_access_key" "user-access-key" {
  user    = aws_iam_user.user.name
  pgp_key = var.pgp-key
}

resource "aws_iam_user_group_membership" "user-groups" {
  user   = aws_iam_user.user.name
  groups = [ var.group ]
}

resource "aws_iam_user_login_profile" "user-login-profile" {
  user    = aws_iam_user.user.name
  pgp_key = var.pgp-key
}

output "password" {
  value = aws_iam_user_login_profile.user-login-profile.encrypted_password
}

output "access-key-id" {
  value = aws_iam_access_key.user-access-key.id
}

output "access-key-secret" {
  value = aws_iam_access_key.user-access-key.encrypted_secret
}
