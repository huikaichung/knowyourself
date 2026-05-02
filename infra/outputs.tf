output "frontend_url" {
  value = google_cloud_run_v2_service.frontend.uri
}

output "artifact_registry" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.frontend.repository_id}"
}

output "domain_mapping_records" {
  value       = google_cloud_run_domain_mapping.frontend.status[0].resource_records
  description = "DNS records to set in Squarespace for knowyourself.selfkit.art"
}

output "runtime_sa" {
  value = data.google_service_account.runtime.email
}

output "deployer_sa" {
  value = data.google_service_account.deployer.email
}
