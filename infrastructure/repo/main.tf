variable "name" {
  description = "Repository name"

  type = "string"
}

variable "description" {
  description = "Repostory description"

  type = "string"
}

resource "aws_codecommit_repository" "repo" {
  repository_name = "${var.name}"
  description     = "${var.description}"
}

output "url" {
  value = "${aws_codecommit_repository.repo.clone_url_http}"
}
