terraform {
  backend "gcs" {
    bucket = "tfstate-discord-mxptc-bot-1-svc-my1a"
    prefix = "env/prod"
  }
}
