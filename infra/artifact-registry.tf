resource "google_artifact_registry_repository" "frontend" {
  location      = var.region
  repository_id = "knowyourself"
  description   = "knowyourself frontend container images"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}
