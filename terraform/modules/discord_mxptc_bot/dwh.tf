resource "google_bigquery_connection" "main" {
  connection_id = "main"
  cloud_resource {}
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
    connection_id = ""
    source_uris = [
      "gs://${google_storage_bucket.matches.name}/*.json"
    ]
  }
}
