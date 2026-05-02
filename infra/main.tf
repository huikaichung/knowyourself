provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
  ])

  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}
