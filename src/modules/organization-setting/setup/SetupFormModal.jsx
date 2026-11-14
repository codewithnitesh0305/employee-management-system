import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSetupList } from "./SetupList";
import { ORGANIZATION_SETUP_TYPES } from "./setupConfig";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useToast } from "../../../components/common/Toast/useToast";

function SetupFormModal() {
  const { setupType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { saveItem } = useSetupList();
  const showToast = useToast();
  const setup = ORGANIZATION_SETUP_TYPES[setupType];
  const editingItem = location.state?.item || null;
  const [name, setName] = useState(editingItem?.name || "");
  const [isClosing, setIsClosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const close = () => {
    if (!isSaving) setIsClosing(true);
  };

  const handleDrawerAnimationEnd = (event) => {
    if (event.target === event.currentTarget && isClosing) {
      navigate(`/organization-settings/${setupType}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
        setIsClosing(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving]);

  if (!setup) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast("Name is required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await saveItem({
        id: editingItem?.id ?? null,
        name: trimmedName,
      });
      showToast(
        `${setup.title} ${editingItem ? "updated" : "added"} successfully.`
      );
      close();
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="setup-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isClosing) close();
      }}
    >
      <section
        className={`setup-modal${isClosing ? " is-closing" : ""}`}
        onAnimationEnd={handleDrawerAnimationEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="setup-modal-title"
      >
        <header className="setup-modal-header">
          <h2 id="setup-modal-title">
            {editingItem ? `Edit ${setup.title}` : `Add ${setup.title}`}
          </h2>
          <button
            type="button"
            className="setup-modal-close"
            onClick={close}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="setup-modal-body">
            <label className="setup-form-field">
              <span>
                {setup.nameLabel}
                <span className="setup-required">*</span>
              </span>
              <input
                autoFocus
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={setup.placeholder}
                maxLength={100}
              />
            </label>
          </div>

          <footer className="setup-modal-actions">
            <button
              type="button"
              className="setup-cancel-button"
              onClick={close}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="setup-save-button"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default SetupFormModal;
