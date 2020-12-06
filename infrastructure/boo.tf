variable boo-db-password-dev {}
variable boo-api-key-dev {}

locals {
  boo-domain-name-dev = "boo-api-dev.mhn.me"
}

module boo-domain-dev {
  source = "./subdomain"
  domain-name = local.boo-domain-name-dev
  zone-id = aws_route53_zone.zone.id
  providers = {
    aws = aws.us-east-1
  }
}

module boo-vpc-dev {
  source = "./boo-vpc"
  env = "dev"
  region = "eu-west-2"
}

module boo-db-dev {
  source = "./boo-db"
  env = "dev"
  region = "eu-west-2"
  password = var.boo-db-password-dev
  vpc-security-group-ids = [module.boo-vpc-dev.main-security-group-id]
  vpc-subnets = module.boo-vpc-dev.general-subnets
}

module boo-api-dev {
  source = "./boo-api"
  env = "dev"
  region = "eu-west-2"
  acm-certificate-arn = module.boo-domain-dev.certificate-arn
  domain-name = local.boo-domain-name-dev
  route53-zone-id = aws_route53_zone.zone.id
  api-key = var.boo-api-key-dev
}

module boo-users-dev {
  source = "./boo-users"
  env = "dev"
}