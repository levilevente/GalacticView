resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4048
}

resource "aws_key_pair" "kp" {
  key_name   = "galactic-prod-key"
  public_key = tls_private_key.pk.public_key_openssh
}


resource "local_file" "ssh_key" {
  filename        = "${path.module}/galactic-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

data "aws_ami" "ubuntu_22_04" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

locals {
  user_data = <<-EOT
    #!/bin/bash
    set -euxo pipefail

    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y curl ca-certificates

    curl -sfL https://get.k3s.io | sh -

    mkdir -p /home/ubuntu/.kube
    cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
    chown -R ubuntu:ubuntu /home/ubuntu/.kube
    chmod 600 /home/ubuntu/.kube/config
  EOT
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu_22_04.id
  instance_type = var.ec2_instance_type

  key_name      = aws_key_pair.kp.key_name
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.web.id]
  associate_public_ip_address = true

  user_data                   = local.user_data
  user_data_replace_on_change = false

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  metadata_options {
    http_tokens                 = "required"
    http_endpoint               = "enabled"
    http_put_response_hop_limit = 2
  }

  tags = {
    Name = "${local.name_prefix}-web"
    Role = "k3s-node"
  }

  lifecycle {
    ignore_changes = [ami]
  }
}
