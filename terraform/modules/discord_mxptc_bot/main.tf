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
      "serviceAccount:${var.terraform_apply_gha_main_service_account_email}"
    ]
  }
}

resource "google_artifact_registry_repository_iam_policy" "main" {
  repository  = google_artifact_registry_repository.main.name
  location    = google_artifact_registry_repository.main.location
  policy_data = data.google_iam_policy.artifact_registry_main.policy_data
}