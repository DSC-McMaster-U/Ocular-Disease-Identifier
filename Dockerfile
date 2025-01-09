FROM python:3.12.7-slim

WORKDIR /app

COPY ./api/ /app

COPY ./backend/4_conv.keras /app/backend/

RUN apt-get update && apt-get install -y --no-install-recommends libgl1-mesa-glx libglib2.0-0 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python3","api.py"]