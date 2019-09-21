locals {
  domain-name = "mhn.me"
  deployer-username = "mhn-me-deployer"
  penalty-secret = "tUPZ3asaJpZxBLnAgSBJ9Q7vWSL4RrWpZ4fQ7fGXzgYKmGzLHry2it5wjFQxYXzk"
}

resource "aws_iam_user" "deployer" {
  name = "${local.deployer-username}"
}

module "site-main" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//site-main"

  domain = "${local.domain-name}"
  bucket_name = "mhn-me"
  duplicate-content-penalty-secret = "${local.penalty-secret}"
  not-found-response-path = "/404.html"
  deployer = "${local.deployer-username}"
  acm-certificate-arn = "${aws_acm_certificate_validation.cert.certificate_arn}"
  price_class = "PriceClass_All"
}

module "site-redirect" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//site-redirect"

  domain = "www.${local.domain-name}"
  target = "${local.domain-name}"
  duplicate-content-penalty-secret = "${local.penalty-secret}"
  deployer = "${local.deployer-username}"
  acm-certificate-arn = "${aws_acm_certificate_validation.cert.certificate_arn}"
}

module "dns-alias" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//r53-alias"

  domain = "${local.domain-name}"
  target = "${module.site-main.website_cdn_hostname}"
  cdn_hosted_zone_id = "${module.site-main.website_cdn_zone_id}"
  route53_zone_id = "${aws_route53_zone.zone.id}"
}

resource "aws_route53_zone" "zone" {
  name = "${local.domain-name}."
}

resource "aws_route53_record" "mx-protonmail" {
  zone_id = "${aws_route53_zone.zone.id}"
  name    = ""
  type    = "MX"
  records = ["10 mail.protonmail.ch"]
  ttl     = "3600"
}

resource "aws_route53_record" "cname-www-mhn-me" {
  zone_id = "${aws_route53_zone.zone.id}"
  name    = "www"
  type    = "CNAME"
  records = ["${local.domain-name}"]
  ttl     = "3600"
}

resource "aws_route53_record" "txt-mhn-me" {
  zone_id = "${aws_route53_zone.zone.id}"
  name    = ""
  type    = "TXT"
  records = [
    "protonmail-verification=85ac5c02a22a2021da9528ae43c74e9d8bde0c14",
    "v=spf1 include:_spf.protonmail.ch include:_spf.freeagent.com ip4:65.39.178.0/24 a mx ~all",
    "freeagent-domain-verification=_uurcBg7G8cMTKkeDFJL"
  ]
  ttl     = "900"
}

resource "aws_route53_record" "txt-protonmail" {
  zone_id = "${aws_route53_zone.zone.id}"
  name    = "protonmail._domainkey"
  type    = "TXT"
  records = ["v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDE/fq2YLY/xO/asTMBFJGewrEh1fDRXQAv7euUufwWqARdV5k4kuavcHjogjH3+YQhq9uDknIlLRxr00b4NfVYcrndbm87JOVJ8UQJpOZInfmweC3Dye3qsMZ1KcnlVk/QgdKurohm+b6+TfqObhAL7OVynSw7r9GdeTt534b09wIDAQAB"]
  ttl     = "900"
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "${local.domain-name}"
  validation_method = "DNS"
  provider          = "aws.us-east-1"

  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_route53_record" "cert-validation" {
  name = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_name}"
  type = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_type}"
  zone_id = "${aws_route53_zone.zone.id}"
  records = ["${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}"]
  ttl = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = "${aws_acm_certificate.cert.arn}"
  validation_record_fqdns = ["${aws_route53_record.cert-validation.fqdn}"]
  provider                = "aws.us-east-1"

  timeouts {
    create = "6h"
  }
}
