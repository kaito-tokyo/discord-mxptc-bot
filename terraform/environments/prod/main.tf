module "discord_mxptc_bot" {
  source                                         = "../../modules/discord_mxptc_bot"
  principalset_terraform_plan_gha_pr             = var.principalset_terraform_plan_gha_pr
  project_id                                     = var.project_id
  region                                         = var.region
  terraform_apply_gha_main_service_account_email = var.terraform_apply_gha_main_service_account_email
  tfstate_bucket_name                            = var.tfstate_bucket_name
}