variable domain-name {type = string}
variable zone-id {type = string}

resource aws_acm_certificate domain-name {
  domain_name       = var.domain-name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource aws_route53_record domain-name {
  for_each = {
    for dvo in aws_acm_certificate.domain-name.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  type            = each.value.type
  zone_id         = var.zone-id
  records         = [each.value.record]
  allow_overwrite = true
  ttl             = 60
}

resource aws_acm_certificate_validation domain-name {
  certificate_arn         = aws_acm_certificate.domain-name.arn
  validation_record_fqdns = [for record in aws_route53_record.domain-name : record.fqdn]

  timeouts {
    create = "6h"
  }
}

output certificate-arn {
  value = aws_acm_certificate.domain-name.arn
}