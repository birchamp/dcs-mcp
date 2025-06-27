# Door43 Model Context Provider

This project exposes a minimal Model Context Protocol (MCP) server that retrieves translation resources from the [Door43 Content Service](https://git.door43.org/).

The server is built with [FastAPI](https://fastapi.tiangolo.com/) and implements two basic endpoints:

- `POST /v1/context` – return the content of a file in a Door43 repository. If no organization is supplied the server defaults to `unfoldingWord`; if no language is supplied the server defaults to `en` (English).
- `GET /v1/catalog/search` – proxy to the Door43 catalog search API.

## Running the server

```bash
pip install -e .
uvicorn server:app --reload
```

## MCP Metadata

The plugin metadata is exposed at `/.well-known/ai-plugin.json`. FastAPI automatically serves the OpenAPI schema at `/openapi.json` and `/docs`.
