resource "google_cloud_run_domain_mapping" "frontend" {
  name     = "${var.subdomain}.${var.domain}"
  location = var.region
  project  = var.project_id

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}
