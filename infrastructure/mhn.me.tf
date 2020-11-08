locals {
  domain-name       = "mhn.me"
  deployer-username = "mhn-me-deployer"
  penalty-secret    = "tUPZ3asaJpZxBLnAgSBJ9Q7vWSL4RrWpZ4fQ7fGXzgYKmGzLHry2it5wjFQxYXzk"
}

resource "aws_iam_user" "deployer" {
  name = local.deployer-username
}

module "site-main" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//site-main"

  domain                           = local.domain-name
  bucket_name                      = "mhn-me"
  duplicate-content-penalty-secret = local.penalty-secret
  not-found-response-path          = "/404.html"
  deployer                         = local.deployer-username
  acm-certificate-arn              = aws_acm_certificate_validation.cert.certificate_arn
  price_class                      = "PriceClass_All"
}

module "site-redirect" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//site-redirect"

  domain                           = "www.${local.domain-name}"
  target                           = local.domain-name
  duplicate-content-penalty-secret = local.penalty-secret
  deployer                         = local.deployer-username
  acm-certificate-arn              = aws_acm_certificate_validation.cert.certificate_arn
}

module "dns-alias" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//r53-alias"

  domain             = local.domain-name
  target             = module.site-main.website_cdn_hostname
  cdn_hosted_zone_id = module.site-main.website_cdn_zone_id
  route53_zone_id    = aws_route53_zone.zone.id
}

resource "aws_route53_zone" "zone" {
  name = "${local.domain-name}."
}

resource "aws_route53_record" "cname-www-mhn-me" {
  zone_id = aws_route53_zone.zone.id
  name    = "www"
  type    = "CNAME"
  records = [ local.domain-name ]
  ttl     = "3600"
}

resource "aws_route53_record" "txt-mhn-me" {
  zone_id = aws_route53_zone.zone.id
  name    = ""
  type    = "TXT"
  records = ["v=spf1 include:amazonses.com ~all"]
  ttl = "900"
}

resource "aws_route53_record" "aws-workmail-mx" {
  zone_id = aws_route53_zone.zone.id
  name    = ""
  type    = "MX"
  records = ["10 inbound-smtp.eu-west-1.amazonaws.com."]
  ttl     = "3600"
}

resource "aws_route53_record" "aws-workmail-ses-verification" {
  zone_id = aws_route53_zone.zone.id
  name    = "_amazonses"
  type    = "TXT"
  records = ["H5I/wSKg8jTx7lF1wqnJ1ep4O3b1nKjkgUHIwkuL5+g="]
  ttl     = "900"
}

resource "aws_route53_record" "aws-workmail-cname-autodiscover" {
  zone_id = aws_route53_zone.zone.id
  name    = "autodiscover"
  type    = "CNAME"
  records = ["autodiscover.mail.eu-west-1.awsapps.com."]
  ttl     = "900"
}

resource "aws_route53_record" "aws-workmail-dkim-1" {
  zone_id = aws_route53_zone.zone.id
  name    = "y2jp5yyzwsgierzvsstizw367gmkpxov._domainkey"
  type    = "CNAME"
  records = ["y2jp5yyzwsgierzvsstizw367gmkpxov.dkim.amazonses.com."]
  ttl     = "900"
}

resource "aws_route53_record" "aws-workmail-dkim-2" {
  zone_id = aws_route53_zone.zone.id
  name    = "kdgrn52yb3wdtt4pco5bka3gumc3tabj._domainkey"
  type    = "CNAME"
  records = ["kdgrn52yb3wdtt4pco5bka3gumc3tabj.dkim.amazonses.com."]
  ttl     = "900"
}

resource "aws_route53_record" "aws-workmail-dkim-3" {
  zone_id = aws_route53_zone.zone.id
  name    = "xfb6xxqwwg3a7pqx7x42hbkpncx6o6q6._domainkey"
  type    = "CNAME"
  records = ["xfb6xxqwwg3a7pqx7x42hbkpncx6o6q6.dkim.amazonses.com."]
  ttl     = "900"
}

resource "aws_route53_record" "aws-workmail-dmarc" {
  zone_id = aws_route53_zone.zone.id
  name    = "_dmarc"
  type    = "TXT"
  records = ["v=DMARC1;p=quarantine;pct=100;fo=1"]
  ttl     = "900"
}

resource "aws_acm_certificate" "cert" {
  domain_name       = local.domain-name
  validation_method = "DNS"
  provider          = aws.us-east-1

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert-validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  type            = each.value.type
  zone_id         = aws_route53_zone.zone.id
  records         = [each.value.record]
  allow_overwrite = true
  ttl             = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert-validation : record.fqdn]
  provider                = aws.us-east-1

  timeouts {
    create = "6h"
  }
}

