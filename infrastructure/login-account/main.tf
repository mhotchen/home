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

resource "aws_iam_user_group_membership" "user-groups" {
  user   = aws_iam_user.user.name
  groups = [ var.group ]
}

resource "aws_iam_user_login_profile" "user-login-profile" {
  user    = aws_iam_user.user.name
  pgp_key = var.pgp-key
}
