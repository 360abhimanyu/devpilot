# DevPilot AI

**Build with clarity. Ship with confidence.**

DevPilot AI is a full-stack, open-source developer companion. It gives learners and software builders one place to ask for code explanations, debugging guidance, code reviews, documentation, Git help, Linux help, and programming lessons.

> DevPilot is a learning assistant, not an execution sandbox. It does not run submitted code.

## Features

- **Explain code** — understand purpose, flow, syntax, and examples.
- **Debug an error** — work through likely root causes and corrected examples.
- **Review code** — get feedback on correctness, readability, maintainability, and basic security.
- **Generate documentation** — create an overview, usage notes, and examples.
- **Git assistant** — learn commands, branching, merging, and safe workflows.
- **Linux assistant** — understand commands, flags, output, and safety considerations.
- **Learn a concept** — receive beginner-friendly explanations and practice tasks.
- **Provider flexibility** — offline guidance works without an API key; optional Ollama and Gemini providers can power responses.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Python, FastAPI |
| API validation | Pydantic |
| HTTP client | HTTPX |
| Configuration | python-dotenv |
| Local model option | Ollama-compatible chat API (configure a locally available model) |
| Hosted model option | Google Gemini API |
| Deployment | Docker |

AI providers are optional. The default `offline` mode uses built-in guidance and makes no external AI calls. When configured, the app sends the prompt and selected mode to the provider you chose. Do not paste secrets or confidential source code.

## Run locally

### 1. Clone and enter the repository

```bash
git clone https://github.com/YOUR_USERNAME/devpilot-ai.git
cd devpilot-ai
```

### 2. Create a virtual environment

**Windows PowerShell**
```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
cp .env.example .env
```

On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

The default `AI_PROVIDER=offline` works immediately.

### 5. Start the app

```bash
uvicorn app.main:app --reload
```

Open **http://127.0.0.1:8000**. Interactive API documentation is available at **http://127.0.0.1:8000/docs**.

## Enable a local Ollama model

1. Install and start [Ollama](https://ollama.com/).
2. Download a model supported by your Ollama installation. For example, choose a Gemma-family model that is currently available in your environment and pull it using the model's exact Ollama tag.
3. In `.env`, set:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=your-installed-model-tag
```

The sample value `gemma4` is only a configurable placeholder. Replace it with the exact model tag available in your Ollama installation. The project does not claim Gemma 4 is installed or used until you configure and test that model.

## Enable Google Gemini

1. Create an API key in Google AI Studio.
2. Add it to your local `.env` file (never commit this file):

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The backend uses the Gemini `generateContent` endpoint. The model name is configurable.

## Run with Docker

Create `.env` from `.env.example`, then run:

```bash
docker compose up --build
```

Open http://localhost:8000.

For Ollama running on the host, `localhost` inside the container refers to the container itself. Configure `OLLAMA_BASE_URL` to a host address reachable from the container (for example, `http://host.docker.internal:11434` where supported).

## API

### `GET /api/health`

Returns service health and version.

### `POST /api/ask`

Request:
```json
{
  "mode": "debug",
  "prompt": "TypeError: cannot read properties of undefined"
}
```

Supported modes: `explain`, `debug`, `review`, `document`, `git`, `linux`, `learn`.

Response:
```json
{
  "answer": "…",
  "provider": "offline",
  "model": "offline-rules"
}
```

## Project structure

```text
devpilot-ai/
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── static/
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── tests/
│   └── test_api.py
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Run tests

Install the test dependencies, then run:

```bash
pip install pytest
pytest -q
```

## Security and responsible use

- Never commit `.env` or expose provider keys in frontend code.
- Do not paste passwords, API keys, private tokens, customer data, or confidential source code.
- AI output can be incorrect. Review suggestions before using them.
- DevPilot does not execute user-submitted code or shell commands.
- The app includes basic prompt guidance, but it is not a substitute for production-grade authentication, authorization, rate limiting, logging controls, or security review.

## Roadmap

- [ ] Conversation history with user-controlled storage
- [ ] Streaming responses
- [ ] Syntax-highlighted code blocks
- [ ] More local model provider adapters
- [ ] Automated secure-code checks
- [ ] Accessibility and localization improvements
- [ ] CI workflow and deployment guide

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Make a focused change and add tests where appropriate.
4. Run the test suite.
5. Open a pull request describing the change.

Please open an issue before large changes so the approach can be discussed.

## License

MIT — see [LICENSE](LICENSE).

---

**Created by Abhimanyu Sharma**

*“The best developer is not the one who knows every answer, but the one who keeps learning how to find better answers.”*
