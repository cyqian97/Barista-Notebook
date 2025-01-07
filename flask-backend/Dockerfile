# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

RUN pip install --no-cache-dir flask flask-sqlalchemy  flask-cors

EXPOSE 5000

# CMD ["python", "app.py"]
CMD ["bash", "-c", "python init_db.py && python app.py"]
