import { useRef } from "react";
import { Upload, X } from "lucide-react";
import "./ImageUpload.css";

function ImageUpload({
  value,
  onChange,
  label = "Employee Photo",
  accept = "image/*",
}) {
  const inputRef = useRef(null);
  const imageSource = value?.previewUrl || value?.url;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (value?.previewUrl) {
      URL.revokeObjectURL(value.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);

    onChange({
      file,
      previewUrl,
    });
  };

  const handleRemove = (event) => {
    event.stopPropagation();

    if (value?.previewUrl) {
      URL.revokeObjectURL(value.previewUrl);
    }

    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-wrapper">
      <label className="employee-form-label">{label}</label>

      <div
        className={`image-upload-box ${value ? "has-image" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleFileChange}
        />

        {imageSource ? (
          <div className="image-upload-preview">
            <img
              src={imageSource}
              alt={`${label} preview`}
            />

            <button
              type="button"
              className="image-upload-remove"
              onClick={handleRemove}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="image-upload-icon">
              <Upload size={22} />
            </div>

            <div className="image-upload-title">
              Drag and drop files here for upload.
            </div>

            <div className="image-upload-subtitle">
              or click to browse from your device
            </div>

            <button
              type="button"
              className="image-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Choose File
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;