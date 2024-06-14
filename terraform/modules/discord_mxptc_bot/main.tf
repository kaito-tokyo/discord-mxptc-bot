resource "google_service_account" "deploy_gha_main" {
  description  = "Service account for deploying the bot"
  account_id   = "${var.namespace_short}-deploy-gha-main"
}

resource "google_artifact_registry_repository" "main" {
  repository_id = "mxptc-bot"
  location      = var.region
  project       = var.project_id
  format        = "DOCKER"
  description   = "Docker repository for the mxptc bot"
}

data "google_iam_policy" "artifact_registry_main" {
  binding {
    role = "roles/artifactregistry.writer"
    members = [
      "serviceAccount:${google_service_account.deploy_gha_main.email}"
    ]
  }
}

resource "google_artifact_registry_repository_iam_policy" "main" {
  repository = google_artifact_registry_repository.main.name
  policy_data = data.google_iam_policy.artifact_registry_main.policy_data
}