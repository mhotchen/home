resource "aws_dynamodb_table" "landing-page-answers" {
  name         = "landing-page-answers"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

