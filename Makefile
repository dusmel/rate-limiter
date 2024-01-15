.PHONY: build-api
build-api: ## Build the development docker image.
	docker compose build 

.PHONY: start-api
start-api: ## Start the development docker container.
	docker compose up -d 

.PHONY: build-full
build-full: ## Build the development docker image.
	docker compose build -f docker-compose-full.yml

.PHONY: start-full
start-full: ## Start the development docker container.
	docker compose up -d -f docker-compose-full.yml

