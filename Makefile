.PHONY: build-api
build-api: ## Build the development docker image.
	docker compose build 

.PHONY: start-api
start-api: ## Start the development docker container.
	 cp .env.example .env  && docker compose up -d 

.PHONY: build-full
build-full: ## Build the development docker image.
	docker compose -f docker-compose-full.yml build 

.PHONY: start-full
start-full: ## Start the development docker container.
	docker compose -f docker-compose-full.yml up -d 

