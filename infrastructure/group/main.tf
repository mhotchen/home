variable "group-name" {
  type = string
}

variable "policy-name" {
  type = string
}

variable "policy-document" {
  type = string
}

resource "aws_iam_group" "group" {
  name = var.group-name
}

resource "aws_iam_policy" "policy" {
  name   = var.policy-name
  policy = var.policy-document
}

resource "aws_iam_group_policy_attachment" "attachment" {
  group      = aws_iam_group.group.name
  policy_arn = aws_iam_policy.policy.arn
}