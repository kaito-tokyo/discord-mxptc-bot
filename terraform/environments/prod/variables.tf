variable "principalset_terraform_plan_gha_pr" {
  type        = string
  description = "The principal set for Terraform verification on GHA"
}

variable "project_id" {
  type        = string
  description = "The project ID to deploy the bot to"
}

variable "region" {
  type        = string
  description = "The region to deploy the bot to"
}

variable "tfstate_bucket_name" {
  type        = string
  description = "The name of the tfstate bucket"
}
