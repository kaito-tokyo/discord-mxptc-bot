# discord-mxptc-bot

## Variables

```
PROJECT_ID=discord-mxptc-bot-1-svc-my1a
NAMESPACE=mxptc-bot
NAMESPACE_SHORT=mpb
REGION=asia-east1
TFSTATE_BUCKET_NAME="tfstate-$PROJECT_ID"
GHA_SERVICE_ACCOUNT_NAME="$NAMESPACE_SHORT-terraform-apply-gha-main"
GHA_PRINCIPALSET="principalSet://iam.googleapis.com/projects/643615470006/locations/global/workloadIdentityPools/github-kaito-tokyo/attribute.repo_ref_workflow/repo:kaito-tokyo/discord-mxptc-bot:ref:refs/heads/main:workflow:terraform-apply-main"
```

## Enable required services

```
gcloud services enable \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com
```

## Create a Cloud Storage bucket for tfstate

```
gcloud storage buckets create "gs://$TFSTATE_BUCKET_NAME" \
  --location="$REGION" \
  --public-access-prevention \
  --uniform-bucket-level-access

gcloud storage buckets update "gs://$TFSTATE_BUCKET_NAME" --versioning
```

## Grant to Terraform on GitHub Actions

```
gcloud iam service-accounts create "$GHA_SERVICE_ACCOUNT_NAME"

gcloud iam service-accounts add-iam-policy-binding "$GHA_SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --member="$GHA_PRINCIPALSET" \
  --role="roles/iam.workloadIdentityUser" \
  --condition=None

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$GHA_SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/owner \
  --condition=None

gcloud storage buckets add-iam-policy-binding gs://$TFSTATE_BUCKET_NAME \
  --member="serviceAccount:$GHA_SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/storage.objectUser \
  --condition=None
```

## Enable additional services

```
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  serviceusage.googleapis.com
```
