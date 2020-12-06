variable region {type = string}
variable env {type = string}

resource aws_vpc boo {
  tags = {
    Name = "boo-vpc-${var.region}-${var.env}"
  }
  cidr_block = "172.31.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support = true
}

resource aws_subnet boo-general-a {
  vpc_id = aws_vpc.boo.id
  cidr_block = "172.31.0.0/20"
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true
}

resource aws_subnet boo-lambda-nat-a {
  vpc_id = aws_vpc.boo.id
  cidr_block = "172.31.64.0/20"
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = false
}

resource aws_subnet boo-general-b {
  vpc_id = aws_vpc.boo.id
  cidr_block = "172.31.16.0/20"
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = true
}

resource aws_subnet boo-lambda-nat-b {
  vpc_id = aws_vpc.boo.id
  cidr_block = "172.31.32.0/20"
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = false
}

resource aws_subnet boo-lambda-igw-b {
  vpc_id = aws_vpc.boo.id
  cidr_block = "172.31.48.0/20"
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = false
}

resource aws_internet_gateway boo {
  vpc_id = aws_vpc.boo.id
}

resource aws_network_interface boo {
  subnet_id = aws_subnet.boo-lambda-igw-b.id
  private_ip = "172.31.53.27"
  source_dest_check = false
}

resource aws_eip boo {
  vpc = true
}

resource aws_nat_gateway boo {
  allocation_id = aws_eip.boo.id
  subnet_id = aws_subnet.boo-lambda-igw-b.id
}

resource aws_route_table boo-igw {
  vpc_id = aws_vpc.boo.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.boo.id
  }
}

resource aws_route_table_association boo-general-igw-a {
  route_table_id = aws_route_table.boo-igw.id
  subnet_id = aws_subnet.boo-general-a.id
}

resource aws_route_table_association boo-general-igw-b {
  route_table_id = aws_route_table.boo-igw.id
  subnet_id = aws_subnet.boo-general-b.id
}

resource aws_route_table_association boo-lambda-igw-b {
  route_table_id = aws_route_table.boo-igw.id
  subnet_id = aws_subnet.boo-lambda-igw-b.id
}

resource aws_route_table main {
  vpc_id = aws_vpc.boo.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.boo.id
  }
}

resource aws_route_table lambda-nat {
  vpc_id = aws_vpc.boo.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.boo.id
  }
}

resource aws_route_table_association lambda-nat-a {
  route_table_id = aws_route_table.lambda-nat.id
  subnet_id = aws_subnet.boo-lambda-nat-a.id
}

resource aws_route_table_association lambda-nat-b {
  route_table_id = aws_route_table.lambda-nat.id
  subnet_id = aws_subnet.boo-lambda-nat-b.id
}

//resource aws_network_acl main {
//  vpc_id = aws_vpc.boo.id
//  subnet_ids = [
//    aws_subnet.boo-general-a.id,
//    aws_subnet.boo-general-b.id,
//    aws_subnet.boo-lambda-nat-a.id,
//    aws_subnet.boo-lambda-nat-b.id,
//    aws_subnet.boo-lambda-igw-b.id,
//  ]
//}

resource aws_security_group main {
  name = "boo-vpc-${var.env}"
  vpc_id = aws_vpc.boo.id
}

resource aws_security_group_rule internal {
  security_group_id = aws_security_group.main.id
  type = "ingress"
  from_port = 0
  to_port = 0
  protocol = "-1"
  self = true
}

resource aws_security_group_rule internal-egress {
  security_group_id = aws_security_group.main.id
  type = "egress"
  from_port = 0
  to_port = 0
  protocol = "-1"
  self = true
}

resource aws_security_group_rule outbound {
  security_group_id = aws_security_group.main.id
  type = "egress"
  from_port = 0
  to_port = 65535
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource aws_security_group_rule postgres-inbound {
  security_group_id = aws_security_group.main.id
  type = "ingress"
  from_port = 5432
  to_port = 5432
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource aws_ssm_parameter main-security-group {
  name = "/${var.env}/boo-vpc/main-security-group"
  type = "SecureString"
  value = aws_security_group.main.id
}

resource aws_ssm_parameter lambda-subnet-a {
  name = "/${var.env}/boo-vpc/lambda-subnet-a"
  type = "SecureString"
  value = aws_subnet.boo-lambda-nat-a.id
}

resource aws_ssm_parameter lambda-subnet-b {
  name = "/${var.env}/boo-vpc/lambda-subnet-b"
  type = "SecureString"
  value = aws_subnet.boo-lambda-nat-b.id
}

output main-security-group-id {
  value = aws_security_group.main.id
}

output general-subnets {
  value = [aws_subnet.boo-general-a.id, aws_subnet.boo-general-b.id]
}