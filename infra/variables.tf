variable "project_id" {
  type    = string
  default = "selfkitart"
}

variable "region" {
  type    = string
  default = "asia-northeast1"
}

variable "domain" {
  type    = string
  default = "selfkit.art"
}

variable "subdomain" {
  type    = string
  default = "knowyourself"
}

variable "image_tag" {
  description = "Container image tag (set by CI to GITHUB_SHA)"
  type        = string
  default     = "latest"
}
