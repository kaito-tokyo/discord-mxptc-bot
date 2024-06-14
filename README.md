# discord-mxptc-bot

## Variables

```
PROJECT_ID=discord-mxptc-bot-1-svc-my1a
NAMESPACE=mxptc-bot
NAMESPACE_SHORT=mpb
REGION=asia-east1
TFSTATE_BUCKET_NAME="tfstate-$PROJECT_ID"
GHA_MAIN_SERVICE_ACCOUNT_NAME="$NAMESPACE_SHORT-terraform-gha-main"
GHA_PR_SERVICE_ACCOUNT_NAME="$NAMESPACE_SHORT-terraform-gha-pr"
GHA_PR_PRINCIPALSET="principalSet://iam.googleapis.com/projects/643615470006/locations/global/workloadIdentityPools/github-kaito-tokyo/attribute.repository/kaito-tokyo/discord-mxptc-bot"
GHA_PR_WORKFLOW_NAME="$NAMESPACE-terraform-pr"
```

## Enable services for terraform

```
gcloud services enable \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  artifactregistry.googleapis.com
```

## Create a Cloud Storage bucket for tfstate

```
gcloud storage buckets create "gs://$TFSTATE_BUCKET_NAME" \
  --location="$REGION" \
  --public-access-prevention \
  --uniform-bucket-level-access

gcloud storage buckets update "gs://$TFSTATE_BUCKET_NAME" --versioning
```

## Create a Cloud Build trigger for Terraform

Add a connection for GitHub on Cloud Build first.

```
gcloud iam service-accounts create "$CB_SERVICE_ACCOUNT_NAME"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$CB_SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/owner \
  --condition=None

gcloud storage buckets add-iam-policy-binding gs://$TFSTATE_BUCKET_NAME \
  --member="serviceAccount:$CB_SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/storage.objectAdmin \
  --condition=None

gcloud builds triggers create github \
  --name="$TRIGGER_NAME" \
  --region="$REGION" \
  --repository="$CB_REPOSITORY" \
  --branch-pattern="^main$" \
  --build-config="$WORKFLOW_PATH" \
  --service-account="projects/$PROJECT_ID/serviceAccounts/$CB_SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --include-logs-with-status \
  --substitutions=_RUN_REPOSITORY="$REGION-docker.pkg.dev/$PROJECT_ID/$NAMESPACE_SHORT-run-source-deploy"
```

## Setup the artifact registry for Cloud Run

```
gcloud artifacts repositories create "$NAMESPACE_SHORT-run-source-deploy" \
  --location="$REGION" \
  --repository-format=DOCKER
```

### Enable additional services

```
gcloud services enable \
  run.googleapis.com \
  workflows.googleapis.com \
  cloudresourcemanager.googleapis.com \
  secretmanager.googleapis.com
```

## Google Cloud

### Bootstrap infra

```
PROJECT_ID=discord-mxptc-bot-1-svc-my1a
SERVICE_ACCOUNT_NAME=infra-manager-bootstrap
gcloud config set project $PROJECT_ID
PROJECT_NUMBER=$(gcloud projects list --filter="$(gcloud config get-value project)" --format="value(PROJECT_NUMBER)")
REGION=asia-east1
POOL_ID=github-umireon
```

```
gcloud services enable config.googleapis.com
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/config.agent
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/iam.workloadIdentityPoolAdmin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/iam.serviceAccountAdmin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/resourcemanager.projectIamAdmin
```

```
gcloud infra-manager deployments apply \
  "projects/$PROJECT_ID/locations/$REGION/deployments/wif-github-umireon" \
  --local-source="./modules/wif-github-umireon" \
  --service-account="projects/$PROJECT_ID/serviceAccounts/$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --input-values="project_id=$PROJECT_ID"
```

```
gcloud infra-manager deployments apply \
  "projects/$PROJECT_ID/locations/$REGION/deployments/wif-gha-www-kaito-tokyo" \
  --local-source="./modules/wif-gha-www-kaito-tokyo" \
  --service-account="projects/$PROJECT_ID/serviceAccounts/$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --input-values="project_id=$PROJECT_ID,project_number=$PROJECT_NUMBER,pool_id=$POOL_ID"
```
