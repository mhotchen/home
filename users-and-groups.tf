# Groups

module "group_admin_console" {
  source          = "./group"
  group_name      = "admin_console"
  policy_name     = "GroupAdminConsole"
  policy_document = "${file("policy-documents/GroupAdminConsole.json")}"
}

module "group_admin_cli" {
  source          = "./group"
  group_name      = "admin_cli"
  policy_name     = "GroupAdminCli"
  policy_document = "${file("policy-documents/GroupAdminCli.json")}"
}

# Users

module "mhn_accounts" {
  source        = "./user"
  username      = "mhn"
  pgp_key       = "keybase:mhn"
  console_group = "admin_console"
  cli_group     = "admin_cli"
}

output "mhn_account" { value = "\n\n${module.mhn_accounts.password}\n\n${module.mhn_accounts.access_token}\n" }
