output "ec2_public_ip" {
  description = "Public IP address of the EC2 web/k3s instance."
  value       = aws_instance.web.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 web/k3s instance."
  value       = aws_instance.web.public_dns
}

output "rds_endpoint" {
  description = "PostgreSQL RDS endpoint URL (host:port)."
  value       = aws_db_instance.postgres.endpoint
}

output "rds_address" {
  description = "PostgreSQL RDS hostname (without port)."
  value       = aws_db_instance.postgres.address
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket created for blog images."
  value       = aws_s3_bucket.blog_images.bucket
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table used for blog post metadata."
  value       = aws_dynamodb_table.blog_posts.name
}

output "vpc_id" {
  description = "ID of the created VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the two public subnets."
  value       = aws_subnet.public[*].id
}
