data "google_service_account" "runtime" {
  account_id = "knowyourself-runtime"
  project    = var.project_id
}

data "google_service_account" "deployer" {
  account_id = "github-deployer-ky"
  project    = var.project_id
}
