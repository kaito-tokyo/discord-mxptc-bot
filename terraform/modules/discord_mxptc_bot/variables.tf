variable "principalset_terraform_gha_pr" {
  type        = string
  description = "The principal set for Terraform verification on GHA"
}

variable "project_id" {
  type        = string
  description = "The project ID to deploy the bot to"
}

variable "tfstate_bucket_name" {
  type        = string
  description = "The name of the tfstate bucket"
}

variable "namespace_short" {
  type        = string
  description = "The short namespace for the project"
  default     = "mpb"
}
