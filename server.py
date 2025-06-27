import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import httpx

API_BASE_URL = "https://git.door43.org/api/v1"
DEFAULT_ORG = "unfoldingWord"
DEFAULT_LANG = "en"

app = FastAPI(title="Door43 MCP", version="0.1.0")

async def fetch_repo_file(owner: str, repo: str, path: str, ref: str | None = None) -> str:
    url = f"{API_BASE_URL}/repos/{owner}/{repo}/contents/{path}"
    params = {}
    if ref:
        params["ref"] = ref
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail=f"Door43 API error: {r.text}")
        data = r.json()
        if "content" not in data:
            raise HTTPException(status_code=500, detail="Invalid response from Door43 API")
        return data["content"]

@app.post("/v1/context")
async def get_context(owner: str | None = None, language: str | None = None, resource: str = "", path: str = "", ref: str | None = None):
    """Return file content from Door43"""
    owner = owner or DEFAULT_ORG
    language = language or DEFAULT_LANG
    if not resource or not path:
        raise HTTPException(status_code=400, detail="resource and path are required")
    repo = f"{language}_{resource}"
    content = await fetch_repo_file(owner, repo, path, ref)
    return JSONResponse({"content": content})

@app.get("/v1/catalog/search")
async def catalog_search(lang: str | None = None, resource: str | None = None, subject: str | None = None):
    lang = lang or DEFAULT_LANG
    url = f"{API_BASE_URL}/catalog/search"
    params = {"lang": lang}
    if resource:
        params["resource"] = resource
    if subject:
        params["subject"] = subject
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail=f"Door43 API error: {r.text}")
        return JSONResponse(r.json())
