variable "username" { type = "string" }
variable "pgp_key" { type = "string" }
variable "cli_group" { type = "string" }
variable "console_group" { type = "string" }

# CLI user

resource "aws_iam_user" "cli_user" {
  name          = "${var.username}_cli"
  path          = "/"
  force_destroy = true
}

resource "aws_iam_access_key" "cli_user_access_key" {
  user    = "${aws_iam_user.cli_user.name}"
  pgp_key = "${var.pgp_key}"
}

resource "aws_iam_user_group_membership" "cli_user_groups" {
  user   = "${aws_iam_user.cli_user.name}"
  groups = ["${var.cli_group}"]
}

# AWS console user

resource "aws_iam_user" "console_user" {
  name          = "${var.username}_console"
  path          = "/"
  force_destroy = true
}

resource "aws_iam_user_login_profile" "console_user_login_profile" {
  user    = "${aws_iam_user.console_user.name}"
  pgp_key = "${var.pgp_key}"
}

resource "aws_iam_user_group_membership" "console_user_groups" {
  user   = "${aws_iam_user.console_user.name}"
  groups = ["${var.console_group}"]
}

output "password" {
  value = "User: ${aws_iam_user.console_user.name}\nPassword: echo \"${aws_iam_user_login_profile.console_user_login_profile.encrypted_password}\" | base64 --decode | gpg --decrypt"
}
output "access_token" {
  value = "User: ${aws_iam_user.cli_user.name}\nAccess ID: ${aws_iam_access_key.cli_user_access_key.id}\nAccess key: echo \"${aws_iam_access_key.cli_user_access_key.encrypted_secret}\" | base64 --decode | gpg --decrypt"
}
