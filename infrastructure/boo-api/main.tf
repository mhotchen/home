variable env {type = string}
variable region {type = string}
variable domain-name {type = string}
variable route53-zone-id {type = string}
variable acm-certificate-arn {type = string}
variable api-key {type = string}

resource aws_route53_record boo {
  name = var.domain-name
  type = "A"
  zone_id = var.route53-zone-id

  alias {
    evaluate_target_health = true
    name = aws_cloudfront_distribution.boo.domain_name
    zone_id = aws_cloudfront_distribution.boo.hosted_zone_id
  }
}

resource aws_cloudfront_distribution boo {
  enabled = true
  is_ipv6_enabled = true
  aliases = [var.domain-name]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm-certificate-arn
    ssl_support_method = "sni-only"
  }

  origin {
    domain_name = "${aws_api_gateway_rest_api.boo.id}.execute-api.${var.region}.amazonaws.com"
    origin_id = "boo-${var.region}-${var.env}"
    origin_path = "/${var.env}" # The stage name from the API gateway, which is managed by serverless

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "boo-${var.region}-${var.env}"

    default_ttl = 0
    min_ttl = 0
    max_ttl = 0

    forwarded_values {
      query_string = true
      headers = ["Authorization", "version", "X-Api-Key", "Content-Type"]
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }
}


resource aws_api_gateway_rest_api boo {
  name = "boo-${var.env}"

  endpoint_configuration {
    types = ["EDGE"]
  }
}

resource aws_ssm_parameter rest-api-id {
  name = "/${var.env}/boo-api/rest-api-id"
  type = "SecureString"
  value = aws_api_gateway_rest_api.boo.id
}

resource aws_ssm_parameter rest-api-key {
  name = "/${var.env}/boo-api/rest-api-key"
  type = "SecureString"
  value = var.api-key
}

resource aws_ssm_parameter domain-name {
  name = "/${var.env}/boo-api/domain-name"
  type = "SecureString"
  value = aws_route53_record.boo.name
}

resource aws_ssm_parameter rest-api-root-resource-id {
  name = "/${var.env}/boo-api/rest-api-root-resource-id"
  type = "SecureString"
  value = aws_api_gateway_rest_api.boo.root_resource_id
}