resource "aws_s3_bucket" "terraform-state" {
  bucket = "64884c6f-e501-41ae-bbdc-b17b81285d81"
  acl    = "private"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "terraform-state-lock" {
  name           = "terraform-state-lock"
  hash_key       = "LockID"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "LockID"
    type = "S"
  }
}

terraform {
  backend "s3" {
    region         = "eu-west-2"
    profile        = "personal"
    encrypt        = true
    bucket         = "64884c6f-e501-41ae-bbdc-b17b81285d81"
    dynamodb_table = "terraform-state-lock"
    key            = "terraform.tfstate"
  }
}

