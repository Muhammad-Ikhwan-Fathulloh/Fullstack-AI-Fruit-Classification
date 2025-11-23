const fileInput = document.getElementById("file-input");
const uploadArea = document.getElementById("upload-area");
const errorMessage = document.getElementById("error-message");
const previewSection = document.getElementById("preview-section");
const previewImage = document.getElementById("preview-image");
const predictBtn = document.getElementById("predict-btn");
const resetBtn = document.getElementById("reset-btn");
const resultSection = document.getElementById("result-section");
const infoSection = document.getElementById("info-section");

let selectedFile = null;

/* ---------------- Drag & Drop ---------------- */
uploadArea.addEventListener("dragenter", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-active");
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

uploadArea.addEventListener("dragleave", (e) => {
  uploadArea.classList.remove("drag-active");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-active");

  const file = e.dataTransfer.files[0];
  if (file) handleFileSelection(file);
});

/* ---------------- File Selection ---------------- */
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleFileSelection(file);
});

function handleFileSelection(file) {
  // Validasi tipe
  if (!file.type.startsWith("image/")) {
    showError("File harus berupa gambar (JPG, PNG)");
    return;
  }

  // Validasi ukuran
  if (file.size > 10 * 1024 * 1024) {
    showError("Ukuran file maksimal 10MB");
    return;
  }

  selectedFile = file;
  errorMessage.style.display = "none";

  // Preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewSection.style.display = "block";
    infoSection.style.display = "none";
  };
  reader.readAsDataURL(file);
}

function showError(msg) {
  errorMessage.innerText = "⚠️ " + msg;
  errorMessage.style.display = "block";
}

/* ---------------- Prediction ---------------- */
predictBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    showError("Pilih gambar terlebih dahulu");
    return;
  }

  predictBtn.innerText = "Memproses...";
  predictBtn.disabled = true;

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const res = await fetch("http://localhost:8000/predict/fruit", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      showError(err.detail || "Gagal melakukan prediksi");
      return;
    }

    const result = await res.json();
    showPrediction(result);

  } catch (err) {
    showError("Terjadi kesalahan: " + err.message);
  }

  predictBtn.innerText = "🔮 Prediksi Buah";
  predictBtn.disabled = false;
});

/* ---------------- Show Prediction ---------------- */
function showPrediction(result) {
  resultSection.style.display = "block";

  document.getElementById("confidence-badge").innerText =
    Math.round(result.confidence * 100) + "% yakin";
  
  document.getElementById("predicted-fruit").innerText = result.prediction;
  document.getElementById("filename").innerText = "File: " + result.filename;

  const list = document.getElementById("prediction-list");
  list.innerHTML = "";

  Object.entries(result.all_predictions)
    .sort((a, b) => b[1] - a[1])
    .forEach(([fruit, conf]) => {
      const item = document.createElement("div");
      item.className = "prediction-item";

      item.innerHTML = `
        <span>${fruit}</span>
        <div class="confidence-container">
          <div class="confidence-bar-container">
            <div class="confidence-bar" style="width:${conf * 100}%"></div>
          </div>
          <span>${Math.round(conf * 100)}%</span>
        </div>
      `;

      list.appendChild(item);
    });
}

/* ---------------- Reset ---------------- */
resetBtn.addEventListener("click", () => {
  selectedFile = null;
  previewSection.style.display = "none";
  resultSection.style.display = "none";
  infoSection.style.display = "block";
  fileInput.value = "";
});