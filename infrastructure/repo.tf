module "services" {
  source      = "./repo"
  name        = "Services"
  description = "Services monorepo."
}

output "repo-url" {
  value = "${module.services.url}\n"
}

