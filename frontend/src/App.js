import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, JPEG)');
      return;
    }

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setPrediction(null);

    // Buat preview gambar
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Pilih gambar terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/predict/fruit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Gagal melakukan prediksi');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError('');
    // Reset input file
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🍎 Fruit Classifier AI</h1>
          <p>Unggah gambar buah untuk diklasifikasikan oleh model AI</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Upload Section */}
          <div className="upload-section">
            <div className="section-card">
              <h2>📤 Upload Gambar Buah</h2>
              
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <label htmlFor="file-input" className="upload-label">
                  <div className="upload-content">
                    <span className="upload-icon">📁</span>
                    <p><strong>Klik untuk memilih file</strong> atau drag & drop di sini</p>
                    <small>Format: JPG, PNG, JPEG | Maksimal: 10MB</small>
                  </div>
                </label>
              </div>

              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}

              {/* Preview Section */}
              {previewUrl && (
                <div className="preview-section">
                  <h3>🖼️ Preview Gambar</h3>
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                    <div className="preview-actions">
                      <button 
                        onClick={handlePredict} 
                        disabled={loading}
                        className="predict-btn"
                      >
                        {loading ? (
                          <>
                            <span className="loading-spinner"></span>
                            Memproses...
                          </>
                        ) : (
                          '🔮 Prediksi Buah'
                        )}
                      </button>
                      <button onClick={handleReset} className="reset-btn">
                        🔄 Ganti Gambar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
          {prediction && (
            <div className="result-section">
              <div className="section-card">
                <h2>🎯 Hasil Prediksi</h2>
                <div className="prediction-card">
                  <div className="prediction-main">
                    <div className="confidence-badge">
                      {Math.round(prediction.confidence * 100)}% yakin
                    </div>
                    <h3 className="predicted-fruit">
                      {prediction.prediction}
                    </h3>
                    <p className="filename">File: {prediction.filename}</p>
                  </div>

                  <div className="all-predictions">
                    <h4>📊 Semua Kemungkinan:</h4>
                    <div className="prediction-list">
                      {Object.entries(prediction.all_predictions)
                        .sort(([,a], [,b]) => b - a)
                        .map(([fruit, confidence]) => (
                          <div 
                            key={fruit} 
                            className={`prediction-item ${
                              fruit === prediction.prediction ? 'top-prediction' : ''
                            }`}
                          >
                            <span className="fruit-name">{fruit}</span>
                            <div className="confidence-container">
                              <div className="confidence-bar-container">
                                <div 
                                  className="confidence-bar"
                                  style={{ width: `${confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="confidence-percent">
                                {Math.round(confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instruction Section */}
          {!prediction && !previewUrl && (
            <div className="info-section">
              <div className="section-card">
                <h3>💡 Cara Menggunakan</h3>
                <div className="instructions">
                  <div className="instruction-item">
                    <span className="step-number">1</span>
                    <p>Pilih atau drag & drop gambar buah ke area upload</p>
                  </div>
                  <div className="instruction-item">
                    <span className="step-number">2</span>
                    <p>Pastikan gambar jelas dan fokus pada buah</p>
                  </div>
                  <div className="instruction-item">
                    <span className="step-number">3</span>
                    <p>Klik tombol "Prediksi Buah" untuk memproses</p>
                  </div>
                  <div className="instruction-item">
                    <span className="step-number">4</span>
                    <p>Tunggu hasil prediksi dari model AI</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Dibuat dengan ❤️ menggunakan React.js & FastAPI | Fruit Classifier AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;