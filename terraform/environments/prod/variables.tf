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

variable "terraform_apply_gha_main_service_account_email" {
  type        = string
  description = "The service account for Terraform apply on GHA"
}

variable "tfstate_bucket_name" {
  type        = string
  description = "The name of the tfstate bucket"
}

variable "run_image" {
  type        = string
  description = "The image to run the bot with"
}
