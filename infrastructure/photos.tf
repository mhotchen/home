resource "aws_s3_bucket" "photos" {
  bucket = "c54e80e7-fc58-48db-ac87-5fef67069a2d"
  acl    = "public-read"
  region = "eu-west-2"

  lifecycle {
    prevent_destroy = true
  }
}
