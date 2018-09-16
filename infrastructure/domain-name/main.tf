variable "domain-name" {
  type = "string"
}

variable "subdomains" {
  type = "list"

  default = []
}

variable "vpc-id" {
  type = "string"
}

resource "aws_route53_zone" "zone" {
  name   = "${var.domain-name}"
  vpc_id = "${var.vpc-id}"
}

resource "aws_route53_zone" "subdomains" {
  count  = "${length(var.subdomains)}"
  name   = "${var.subdomains[count.index]}.${var.domain-name}"
}

resource "aws_route53_record" "dev-ns" {
  count   = "${length(var.subdomains)}"
  zone_id = "${aws_route53_zone.zone.zone_id}"
  name    = "${var.subdomains[count.index]}.${var.domain-name}"
  type    = "NS"
  ttl     = "30"

  records = [
    "${aws_route53_zone.subdomains.0.name_servers.0}",
    "${aws_route53_zone.subdomains.0.name_servers.1}",
    "${aws_route53_zone.subdomains.0.name_servers.2}",
    "${aws_route53_zone.subdomains.0.name_servers.3}",
  ]
}

output "id" {
  value = "${aws_route53_zone.zone.id}"
}