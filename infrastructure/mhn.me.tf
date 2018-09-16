module "prod-vpc" {
  source     = "vpc"
  cidr-block = "10.0.1.0/24"
  name       = "mhn-me"
}

module "dev-vpc" {
  source     = "vpc"
  cidr-block = "10.0.2.0/24"
  name       = "dev-mhn-me"
}

module "domain-name" {
  source      = "domain-name"
  domain-name = "mhn.me"
  subdomains  = ["www", "dev"]
  vpc-id      = "${module.prod-vpc.id}"
}

#resource "aws_route53_record" "mhn-me-record" {
#  zone_id = "${module.domain-name.id}"
#  name    = "mhn.me"
#  type    = "A"
#  ttl     = "300"
#  records = ["${aws_eip.lb.public_ip}"]
#}
