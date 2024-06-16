resource "google_bigquery_connection" "main" {
  connection_id = "main"
  location      = var.region
  cloud_resource {}
}

resource "google_storage_bucket_iam_member" "bigquery_connection_matches_viewer" {
  bucket = google_storage_bucket.matches.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_bigquery_connection.main.cloud_resource[0].service_account_id}"
}

resource "google_bigquery_dataset" "main" {
  dataset_id = "main"
  location   = var.region
}

resource "google_bigquery_table" "matches" {
  description = "Matches between decks"
  dataset_id  = google_bigquery_dataset.main.dataset_id
  table_id    = "matches"
  schema = jsonencode([
    {
      name = "createdAt"
      type = "DATETIME"
    },
    {
      name = "firstDeck"
      type = "STRING"
    },
    {
      name = "secondDeck"
      type = "STRING"
    },
    {
      name = "winner"
      type = "STRING"
    },
  ])
  external_data_configuration {
    autodetect    = false
    source_format = "NEWLINE_DELIMITED_JSON"
    connection_id = google_bigquery_connection.main.name
    source_uris = [
      "gs://${google_storage_bucket.matches.name}/*.json"
    ]
  }
}
