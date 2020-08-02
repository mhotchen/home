resource "aws_kms_key" "sharing-is-caring" {
}

resource "aws_s3_bucket" "sharing-is-caring" {
  bucket = "66163ef5-6f57-4590-86d5-12d321ab6d49"
  acl = "public-read"
}