variable "group_name" { type = "string" }
variable "policy_name" { type = "string" }
variable "policy_document" { type = "string" }

resource "aws_iam_group" "group" {
  name = "${var.group_name}"
}

resource "aws_iam_policy" "policy" {
  name = "${var.policy_name}"
  policy = "${var.policy_document}"
}

resource "aws_iam_group_policy_attachment" "attachment" {
  group = "${aws_iam_group.group.name}"
  policy_arn = "${aws_iam_policy.policy.arn}"
}
