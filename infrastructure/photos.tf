resource "aws_s3_bucket" "public" {
  bucket = "c54e80e7-fc58-48db-ac87-5fef67069a2d"
  acl    = "public-read"
  region = "eu-west-2"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket" "private" {
  bucket = "c7171850-8f93-4d04-afe7-1fd248cb253b"
  acl    = "private"
  region = "eu-west-2"

  lifecycle {
    prevent_destroy = true
  }
}
