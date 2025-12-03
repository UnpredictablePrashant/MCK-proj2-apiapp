# MCK-proj2-apiapp

## Quotes Service
The `application` workspace now includes a reusable Quotes Service that fetches daily motivational quotes from the OpenAI API.

### Setup
1. Navigate to `application` and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and populate `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`).

### Usage
Run the sample CLI to print a quote to the terminal:
```bash
npm start
```
You can also import `QuotesService` from `src/services/quotesService.js` in any other module and call `getMotivationalQuote` with optional `audience`, `theme`, and `language` overrides.

### Docker
1. Build the container image from the `application` directory:
   ```bash
   docker build -t quotes-service application
   ```
2. Run the container and pass your OpenAI API key:
   ```bash
   docker run -e OPENAI_API_KEY=sk-xxx quotes-service
   ```
   Override `OPENAI_MODEL`, `audience`, etc., via environment variables or by extending the entrypoint script if needed.

### Kubernetes
Manifests are available under `k8s/`:
- `quotes-configmap.yml` – default quote parameters and OpenAI model.
- `quotes-secret.yml` – base64-encoded `OPENAI_API_KEY` placeholder (replace before applying).
- `quotes-cronjob.yml` – runs the container daily at 08:00 UTC and streams the quote to pod logs.

Apply after pushing your image to a registry:
```bash
kubectl apply -f k8s/
```
