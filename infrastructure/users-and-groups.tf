# Groups

module "group-admin" {
  source          = "./group"
  group-name      = "admin"
  policy-name     = "admin"
  policy-document = file("policy-documents/group-admin.json")
}

# Users

module "mhn" {
  source  = "./login-account"
  name    = "mhn"
  group   = "admin"
  pgp-key = "keybase:mhn"
}

data "template_file" "output" {
  template = file("templates/account-output.tpl")

  vars = {
    name              = "mhn"
    password          = module.mhn.password
    access-key-id     = module.mhn.access-key-id
    access-key-secret = module.mhn.access-key-secret
  }
}

output "mhn-account" {
  value = data.template_file.output.rendered
}

