import React, { useState } from "react";

export function S3UploadTest() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [folder, setFolder] = useState("test-folder");
  const [filename, setFilename] = useState("my-file");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedUrl(null);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("filename", filename);

    setUploading(true);

    try {
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json(); // { url, path }
      setUploadedUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки файла");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Загрузка файла в S3</h2>

      {/* INPUT — FOLDER */}
      <div style={{ marginBottom: 10 }}>
        <label>Папка:</label>
        <input
          type="text"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      {/* INPUT — FILENAME */}
      <div style={{ marginBottom: 10 }}>
        <label>Имя файла (без расширения):</label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      {/* FILE INPUT */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {uploading && <p>Загрузка...</p>}

      {previewUrl && (
        <div style={{ marginTop: 20 }}>
          <p>Локальное превью:</p>
          <img
            src={previewUrl}
            alt="preview"
            style={{ width: 200, borderRadius: 8, objectFit: "cover" }}
          />
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginTop: 20 }}>
          <p>Загружено в S3:</p>
          <img
            src={uploadedUrl}
            alt="uploaded"
            style={{ width: 200, borderRadius: 8, objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
