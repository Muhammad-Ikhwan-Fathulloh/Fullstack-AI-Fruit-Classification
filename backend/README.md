# FastAPI Fruit Classifier API

A simple API built with FastAPI and TensorFlow/Keras to classify fruit images.
This project provides a lightweight and production-ready interface to run image classification using a pre-trained Keras model.

---

## Prasyarat

Pastikan Anda telah menginstal:

* Python 3.9 atau lebih baru
* pip
* Docker (opsional, untuk deployment)
* File model Keras bernama `fruit_classifier_model.h5` pada direktori yang sama dengan `app.py`

---

## Struktur Direktori

```
project/
│── app.py
│── fruit_classifier_model.h5
│── requirements.txt
│── Dockerfile
│── README.md
```

---

## Instalasi dan Menjalankan Secara Lokal

### 1. Membuat Virtual Environment (Opsional namun disarankan)

```
python -m venv venv
```

Aktifkan environment:

Linux/macOS:

```
source venv/bin/activate
```

Windows:

```
.\venv\Scripts\activate
```

### 2. Instal Dependensi

```
pip install -r requirements.txt
```

### 3. Menjalankan API

```
uvicorn app:app --reload
```

API akan berjalan pada alamat:
[http://127.0.0.1:8000](http://127.0.0.1:8000)

### Dokumentasi API Otomatis

Swagger UI:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Redoc:
[http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Health Check

Akses:
[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## Endpoint Prediksi

### URL

`POST /predict/fruit`

### Body Request

Gunakan form-data dengan key bernama `file` berisi file gambar.

Contoh menggunakan curl:

```
curl -X POST "http://127.0.0.1:8000/predict/fruit" \
     -F "file=@apple.jpg"
```

Contoh respons:

```
{
  "prediction": "apple",
  "confidence": 0.97
}
```

---

## Deployment Menggunakan Docker

### 1. Membangun Docker Image

Pastikan file berikut berada pada direktori yang sama:
`app.py`, `requirements.txt`, `Dockerfile`, `fruit_classifier_model.h5`.

Jalankan:

```
docker build -t yourdockerhubusername/fruit-classifier-api:1.0 .
```

Ganti `yourdockerhubusername` dan tag sesuai kebutuhan.

### 2. Menjalankan Container Secara Lokal

```
docker run -d --name fruit-api \
    -p 8000:8000 \
    yourdockerhubusername/fruit-classifier-api:1.0
```

API dapat diakses di:
[http://localhost:8000](http://localhost:8000)

### 3. Push Image ke Docker Hub

Login terlebih dahulu:

```
docker login
```

Push image:

```
docker push yourdockerhubusername/fruit-classifier-api:1.0
```

Image sekarang tersedia di Docker Hub untuk digunakan pada server atau platform cloud apa pun.

---

## Catatan Tambahan

* Pastikan file model `fruit_classifier_model.h5` kompatibel dengan versi TensorFlow yang digunakan.
* Untuk performa lebih baik di produksi, gunakan server seperti Gunicorn atau ubah konfigurasi Uvicorn sesuai kebutuhan.
* Jika ingin menambah kelas baru, latih kembali model Keras Anda dan perbarui APP.