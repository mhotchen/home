locals {
  landing-demo-mhn-me-domain-name       = "landing-demo.mhn.me"
  landing-demo-mhn-me-deployer-username = "landing-demo-mhn-me-deployer"
  landing-demo-mhn-me-penalty-secret    = "TTyf5NLzjsnVbJjysaeA8WGefuxXyM3NvcJQqs3PQH7wuKvUkbr3j5GtnJy5cjca"
}

resource "aws_iam_user" "landing-demo-mhn-me-deployer" {
  name = local.landing-demo-mhn-me-deployer-username
}

module "landing-demo-mhn-me" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//site-main"

  domain                           = local.landing-demo-mhn-me-domain-name
  bucket_name                      = "landing-demo-mhn-me"
  duplicate-content-penalty-secret = local.landing-demo-mhn-me-penalty-secret
  not-found-response-path          = "/404.html"
  deployer                         = local.landing-demo-mhn-me-deployer-username
  acm-certificate-arn              = aws_acm_certificate_validation.landing-demo-mhn-me-cert.certificate_arn
  price_class                      = "PriceClass_All"
}

module "landing-demo-mhn-me-dns-alias" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//r53-alias"

  domain             = local.landing-demo-mhn-me-domain-name
  target             = module.landing-demo-mhn-me.website_cdn_hostname
  cdn_hosted_zone_id = module.landing-demo-mhn-me.website_cdn_zone_id
  route53_zone_id    = aws_route53_zone.zone.id
}

resource "aws_acm_certificate" "landing-demo-mhn-me-cert" {
  domain_name       = local.landing-demo-mhn-me-domain-name
  validation_method = "DNS"
  provider          = aws.us-east-1

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "landing-demo-mhn-me-cert-validation" {
  name    = aws_acm_certificate.landing-demo-mhn-me-cert.domain_validation_options[0].resource_record_name
  type    = aws_acm_certificate.landing-demo-mhn-me-cert.domain_validation_options[0].resource_record_type
  zone_id = aws_route53_zone.zone.id
  records = [aws_acm_certificate.landing-demo-mhn-me-cert.domain_validation_options[0].resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "landing-demo-mhn-me-cert" {
  certificate_arn         = aws_acm_certificate.landing-demo-mhn-me-cert.arn
  validation_record_fqdns = [aws_route53_record.landing-demo-mhn-me-cert-validation.fqdn]
  provider                = aws.us-east-1

  timeouts {
    create = "6h"
  }
}

