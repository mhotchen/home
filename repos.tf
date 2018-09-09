module "infrastructure" {
  source      = "./repo"
  name        = "Infrastructure"
  description = "General infrastructure provisioning"
}

module "mhn_me" {
  source      = "./repo"
  name        = "mhn.me"
  description = "My personal homepage"
}

output "infrastructure_repo" { value = "${module.infrastructure.repository_url}\n" }
output "mhn_me_repo" { value = "${module.mhn_me.repository_url}\n" }
