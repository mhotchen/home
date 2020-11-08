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
