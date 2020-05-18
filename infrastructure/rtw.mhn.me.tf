locals {
  rtw-mhn-me-domain-name       = "rtw.mhn.me"
  rtw-mhn-me-deployer-username = "rtw-mhn-me-deployer"
  rtw-mhn-me-penalty-secret    = "9UiDcm7YDzQMV3JuiVLwW3vyhYYf7pC4YBUmr3XhACq67GuNSAErTgrSAzdArkHP"
}

resource "aws_iam_user" "rtw-mhn-me-deployer" {
  name = local.rtw-mhn-me-deployer-username
}

module "rtw-mhn-me" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//site-main"

  domain                           = local.rtw-mhn-me-domain-name
  bucket_name                      = "rtw-mhn-me"
  duplicate-content-penalty-secret = local.rtw-mhn-me-penalty-secret
  not-found-response-path          = "/404.html" # TODO
  deployer                         = local.rtw-mhn-me-deployer-username
  acm-certificate-arn              = aws_acm_certificate_validation.rtw-mhn-me-cert.certificate_arn
  price_class                      = "PriceClass_All"
}

module "rtw-mhn-me-dns-alias" {
  source = "github.com/ringods/terraform-website-s3-cloudfront-route53//r53-alias"

  domain             = local.rtw-mhn-me-domain-name
  target             = module.rtw-mhn-me.website_cdn_hostname
  cdn_hosted_zone_id = module.rtw-mhn-me.website_cdn_zone_id
  route53_zone_id    = aws_route53_zone.zone.id
}

resource "aws_acm_certificate" "rtw-mhn-me-cert" {
  domain_name       = local.rtw-mhn-me-domain-name
  validation_method = "DNS"
  provider          = aws.us-east-1

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "rtw-mhn-me-cert-validation" {
  name    = aws_acm_certificate.rtw-mhn-me-cert.domain_validation_options[0].resource_record_name
  type    = aws_acm_certificate.rtw-mhn-me-cert.domain_validation_options[0].resource_record_type
  zone_id = aws_route53_zone.zone.id
  records = [aws_acm_certificate.rtw-mhn-me-cert.domain_validation_options[0].resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "rtw-mhn-me-cert" {
  certificate_arn         = aws_acm_certificate.rtw-mhn-me-cert.arn
  validation_record_fqdns = [aws_route53_record.rtw-mhn-me-cert-validation.fqdn]
  provider                = aws.us-east-1

  timeouts {
    create = "6h"
  }
}

