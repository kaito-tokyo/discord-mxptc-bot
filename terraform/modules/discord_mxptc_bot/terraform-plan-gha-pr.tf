resource "google_service_account" "terraform_plan_gha_pr" {
  description = "The service account for Terraform verification on GHA"
  project     = var.project_id
  account_id  = "${var.namespace_short}-terraform-plan-gha-pr"
}

// Grant Terraform verfication to use WIF for this project
resource "google_service_account_iam_member" "terraform_plan_gha_pr_workloadidentityuser" {
  service_account_id = google_service_account.terraform_plan_gha_pr.id
  role               = "roles/iam.workloadIdentityUser"
  member             = var.principalset_terraform_plan_gha_pr
}

// Grant Terraform verfication to view this project
resource "google_project_iam_member" "terraform_plan_gha_pr_viewer" {
  project = var.project_id
  role    = "roles/viewer"
  member  = "serviceAccount:${google_service_account.terraform_plan_gha_pr.email}"
}

// Grant Terraform verfication to view storages on this project
resource "google_project_iam_member" "terraform_plan_gha_pr_storageinsightscollectorservice" {
  project = var.project_id
  role    = "roles/storage.insightsCollectorService"
  member  = "serviceAccount:${google_service_account.terraform_plan_gha_pr.email}"
}

// Grant Terraform verfication to view IAM on this project
resource "google_project_iam_member" "terraform_plan_gha_pr_iamsecurityreviewer" {
  project = var.project_id
  role    = "roles/iam.securityReviewer"
  member  = "serviceAccount:${google_service_account.terraform_plan_gha_pr.email}"
}

// Grant Terraform verfication to view the tfstate bucket
resource "google_storage_bucket_iam_member" "terraform_plan_gha_pr_tfstate_objectviewer" {
  bucket = var.tfstate_bucket_name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.terraform_plan_gha_pr.email}"
}
