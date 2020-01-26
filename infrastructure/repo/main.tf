variable "name" {
  description = "Repository name"

  type = string
}

variable "description" {
  description = "Repostory description"

  type = string
}

resource "aws_sns_topic" "triggers" {
  name = var.name
}

resource "aws_codecommit_repository" "repo" {
  repository_name = var.name
  description     = var.description
}


resource "aws_codecommit_trigger" "triggers" {
  depends_on      = [ aws_codecommit_repository.repo ]
  repository_name = var.name

  trigger {
    name            = var.name
    events          = [ "all" ]
    destination_arn = aws_sns_topic.triggers.arn
  }
}
output "url" {
  value = aws_codecommit_repository.repo.clone_url_http
}
