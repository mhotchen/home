variable env {type = string}
variable region {type = string}
variable password {type = string}
variable vpc-security-group-ids {type = list(string)}
variable vpc-subnets {type = list(string)}

resource aws_db_subnet_group main {
  name = "boo-main-${var.env}"
  subnet_ids = var.vpc-subnets
}

resource aws_db_instance boo {
  identifier = "boo-db-${var.region}"
  engine = "postgres"
  name = "boo"
  username = "fuck_jira"
  password = var.password
  instance_class = "db.t3.micro"
  publicly_accessible = true
  availability_zone = "${var.region}a"
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = var.vpc-security-group-ids
  apply_immediately = true
  allocated_storage = 20
}

resource aws_ssm_parameter db-host {
  name = "/${var.env}/boo-db/db-host"
  type = "SecureString"
  value = aws_db_instance.boo.address
}

resource aws_ssm_parameter db-port {
  name = "/${var.env}/boo-db/db-port"
  type = "SecureString"
  value = aws_db_instance.boo.port
}

resource aws_ssm_parameter db-name {
  name = "/${var.env}/boo-db/db-name"
  type = "SecureString"
  value = aws_db_instance.boo.name
}

resource aws_ssm_parameter username {
  name = "/${var.env}/boo-db/username"
  type = "SecureString"
  value = aws_db_instance.boo.username
}

resource aws_ssm_parameter password {
  name = "/${var.env}/boo-db/password"
  type = "SecureString"
  value = aws_db_instance.boo.password
}