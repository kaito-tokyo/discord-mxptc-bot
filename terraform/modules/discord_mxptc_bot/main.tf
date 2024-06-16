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

// Storage bucket for match records
resource "google_storage_bucket" "matches" {
  name                        = "matches-${var.project_id}"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
}

// Grant the bot to access the match record bucket
resource "google_storage_bucket_iam_member" "run_matches" {
  bucket = google_storage_bucket.matches.name
  role   = "roles/storage.objectUser"
  member = "serviceAccount:${google_service_account.run.email}"
}

// Discord bot for the mxptc server
resource "google_secret_manager_secret" "discord_bot_token" {
  secret_id = "${var.namespace_short}-discord-bot-token"
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

data "google_iam_policy" "secret_manager_discord_bot_token" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = [
      "serviceAccount:${google_service_account.run.email}"
    ]
  }
}

resource "google_secret_manager_secret_iam_policy" "discord_bot_token" {
  secret_id   = google_secret_manager_secret.discord_bot_token.secret_id
  policy_data = data.google_iam_policy.secret_manager_discord_bot_token.policy_data
}

// Discord bot for the mxptc server
resource "google_cloud_run_service" "main" {
  name     = "discord-mxptc-bot"
  location = var.region

  template {
    spec {
      containers {
        image = var.run_image
        env {
          name  = "DISCORD_APPLICATION_ID"
          value = var.discord_application_id
        }
        env {
          name  = "DISCORD_PUBLIC_KEY"
          value = var.discord_public_key
        }
        env {
          name  = "DISCORD_BOT_TOKEN_SECRET_ID"
          value = "${google_secret_manager_secret.discord_bot_token.id}/versions/latest"
        }
        env {
          name  = "MATCHES_BUCKET_NAME"
          value = google_storage_bucket.matches.name
        }
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

// Firestore database for the mxptc server
resource "google_firestore_database" "main" {
  name        = "${var.namespace_short}-main"
  location_id = "asia-east1"
  type        = "FIRESTORE_NATIVE"
}

// Firestore database for the mxptc server
resource "google_project_iam_member" "run_firestore_viewer" {
  project = var.project_id
  role    = "roles/datastore.viewer"
  member  = "serviceAccount:${google_service_account.run.email}"
}
