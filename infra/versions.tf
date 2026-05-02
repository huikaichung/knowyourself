terraform {
  required_version = ">= 1.10"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "selfkitart-tfstate"
    prefix = "knowyourself"
  }
}
