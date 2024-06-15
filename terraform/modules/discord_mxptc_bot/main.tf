resource "google_artifact_registry_repository" "main" {
  repository_id = "discord-mxptc-bot"
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

resource "google_service_account" "run" {
  description = "Service account for the Cloud Run service"
  account_id  = "${var.namespace_short}-run"
}

// Discord bot for the mxptc server
resource "google_cloud_run_service" "main" {
  name     = "discord-mxptc-bot"
  location = var.region

  template {
    spec {
      containers {
        image = var.run_image
      }

      service_account_name = google_service_account.run.email
    }
  }
}

data "google_iam_policy" "cloud_run_main" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers"
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "main" {
  service     = google_cloud_run_service.main.name
  location    = google_cloud_run_service.main.location
  policy_data = data.google_iam_policy.cloud_run_main.policy_data
}
