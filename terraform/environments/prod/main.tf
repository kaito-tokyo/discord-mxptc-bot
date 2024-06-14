module "discord_mxptc_bot" {
  source                        = "../../modules/discord_mxptc_bot"
  principalset_terraform_gha_pr = var.principalset_terraform_gha_pr
  project_id                    = var.project_id
  tfstate_bucket_name           = var.tfstate_bucket_name
}