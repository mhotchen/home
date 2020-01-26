variable "name" {
  type = string
}

variable "cidr-block" {
  type = string
}

resource "aws_vpc" "vpc" {
  cidr_block = var.cidr-block

  tags {
    Name = var.name
  }
}

output "id" {
  value = aws_vpc.vpc.id
}

output "arn" {
  value = aws_vpc.vpc.arn
}
