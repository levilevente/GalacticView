FROM python:3.12-slim

WORKDIR /app

ENV POETRY_VERSION=2.2.1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

RUN pip install --no-cache-dir poetry==${POETRY_VERSION}

COPY pyproject.toml poetry.lock README.md ./
RUN poetry install --no-root

COPY galacticview_bot ./galacticview_bot
COPY server ./server
RUN poetry install

EXPOSE 8002

CMD ["uvicorn", "server.serve:app", "--host", "0.0.0.0", "--port", "8002"]
