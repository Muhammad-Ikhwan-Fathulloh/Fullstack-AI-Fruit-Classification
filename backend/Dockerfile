# Gunakan image resmi TensorFlow (sudah ada TF, numpy, dll)
FROM tensorflow/tensorflow:2.10.0

# Install dependencies tambahan
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglu1-mesa \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Install FastAPI, Uvicorn, Pillow, dll
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]