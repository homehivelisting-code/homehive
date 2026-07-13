import { useState, useEffect, useCallback } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const CATEGORIES = ['Sale', 'Lease'];
const TYPES = ['House', 'Unit', 'Apartment'];
const ASPECTS = ['North', 'South', 'East', 'West'];
const STATUSES = ['Available', 'Hold', 'Sold'];
const AGENTS = ['Mahadev Dhanuk', 'Sajjan Sharma', 'Laxman Sanjyal', 'Babbu Yadhav', 'Nilam Acharya'];
const LISTING_STYLES = ['Off-Market', 'Exclusive'];

const emptyForm = {
  category: 'Sale',
  address: '',
  type: 'House',
  beds: 0,
  baths: 0,
  cars: 0,
  livingSize: 0,
  landSize: 0,
  houseArea: 0,
  aspect: 'North',
  price: '',
  status: 'Available',
  listedBy: 'Mahadev Dhanuk',
  notes: '',
  links: [],
  listingStyle: 'Exclusive',
};

const numberFields = ['beds', 'baths', 'cars', 'livingSize', 'landSize', 'houseArea'];

export default function AddEditPropertyModal({ show, onClose, onSave, editingListing }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (show) {
      if (editingListing) {
        setForm({ ...emptyForm, ...editingListing });
      } else {
        setForm({ ...emptyForm });
      }
    }
  }, [editingListing, show]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: numberFields.includes(field) ? (value === '' ? null : parseInt(value, 10) || 0) : value,
    }));
  }, []);

  const handleAddLink = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      links: [...(prev.links || []), { title: '', url: '' }],
    }));
  }, []);

  const handleLinkChange = useCallback((index, field, value) => {
    setForm((prev) => {
      const newLinks = [...(prev.links || [])];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, links: newLinks };
    });
  }, []);

  const handleRemoveLink = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!form.category || !form.address || !form.type) return;
      const autoTitle = form.address.split(',')[0].trim() || form.address;
      onSave({ ...form, title: autoTitle });
      onClose();
    },
    [form, onSave, onClose]
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  if (!show) return null;

  const isLease = form.category === 'Lease';
  const isHouse = form.type === 'House';
  const isEditing = !!editingListing;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit Property' : 'Add Property'}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">{isEditing ? 'Edit Property' : 'Add New Property'}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* ---- Section: Basic Info ---- */}
              <div className="form-section">Basic Information</div>

              {/* Row: Category + Type (left) | Aspect + Status (right) */}
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === 'Lease' ? 'For Lease' : 'For Sale'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Type <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Aspect</label>
                <select
                  className="form-select"
                  value={form.aspect}
                  onChange={(e) => handleChange('aspect', e.target.value)}
                >
                  {ASPECTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* ---- Section: Property Details ---- */}
              <div className="form-section">Property Details</div>

              {/* Row: Beds + Baths + Cars (left) | Living Size + Land Size + House Area (right) */}
              <div className="form-group">
                <label className="form-label">Beds</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="20"
                  value={form.beds ?? ''}
                  onChange={(e) => handleChange('beds', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Baths</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="15"
                  value={form.baths ?? ''}
                  onChange={(e) => handleChange('baths', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cars</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="10"
                  value={form.cars ?? ''}
                  onChange={(e) => handleChange('cars', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Living Size (m²)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="2000"
                  value={form.livingSize ?? ''}
                  onChange={(e) => handleChange('livingSize', e.target.value)}
                />
              </div>

              {isHouse && (
                <div className="form-group">
                  <label className="form-label">Land Size (m²)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    max="10000"
                    value={form.landSize ?? ''}
                    onChange={(e) => handleChange('landSize', e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">House Area (m²)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="2000"
                  value={form.houseArea ?? ''}
                  onChange={(e) => handleChange('houseArea', e.target.value)}
                />
              </div>

              {/* ---- Section: Listing Info ---- */}
              <div className="form-section">Listing Information</div>

              {/* Full-width: Address */}
              <div className="form-group full-width">
                <label className="form-label">
                  Address <span className="required">*</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="e.g. Unit 5201, 100 Skyline Blvd, Sydney NSW 2000"
                  required
                />
              </div>

              {/* Full-width: Price */}
              <div className="form-group full-width">
                <label className="form-label">
                  {isLease ? 'Weekly Rent' : 'Price'} <span className="required">*</span>
                </label>
                <div className="price-input-wrapper">
                  <span className="price-prefix">$</span>
                  <input
                    className="form-input price-field"
                    type="text"
                    value={form.price ?? ''}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder={isLease ? 'e.g. 750/wk' : 'e.g. 700-800k, 1.2M, 2350000'}
                  />
                  {isLease && <span className="price-suffix">/wk</span>}
                </div>
              </div>

              {/* Row: Listed By + Listing Style */}
              <div className="form-group">
                <label className="form-label">Listed By</label>
                <select
                  className="form-select"
                  value={form.listedBy}
                  onChange={(e) => handleChange('listedBy', e.target.value)}
                >
                  {AGENTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Listing Style</label>
                <select
                  className="form-select"
                  value={form.listingStyle}
                  onChange={(e) => handleChange('listingStyle', e.target.value)}
                >
                  {LISTING_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* ---- Section: Additional ---- */}
              <div className="form-section">Additional Details</div>

              {/* Full-width: Notes */}
              <div className="form-group full-width">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Optional notes about this property..."
                />
              </div>

              {/* Full-width: Links */}
              <div className="form-group full-width">
                <label className="form-label">Document Links</label>
                <div className="links-manager">
                  {(form.links || []).map((link, index) => (
                    <div key={index} className="link-row">
                      <input
                        className="form-input link-title-input"
                        type="text"
                        value={link.title}
                        onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                        placeholder="Title (e.g. Floorplan)"
                      />
                      <input
                        className="form-input link-url-input"
                        type="url"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                      />
                      <button
                        type="button"
                        className="btn-remove-link"
                        onClick={() => handleRemoveLink(index)}
                        aria-label="Remove link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-link"
                    onClick={handleAddLink}
                  >
                    <Plus size={14} />
                    Add Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? <Save size={16} /> : <Plus size={16} />}
              {isEditing ? 'Save Changes' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-section {
          grid-column: span 2;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-gold);
          padding-bottom: 4px;
          border-bottom: 1px solid var(--border-subtle);
          margin-top: 6px;
        }

        .required {
          color: var(--accent-gold);
          margin-left: 2px;
        }

        .price-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .price-prefix {
          background: rgba(229, 193, 88, 0.08);
          border: 1px solid var(--glass-border);
          border-right: none;
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          padding: 10px 12px;
          color: var(--accent-gold);
          font-weight: 700;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
        }

        .price-suffix {
          background: rgba(229, 193, 88, 0.08);
          border: 1px solid var(--glass-border);
          border-left: none;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          padding: 10px 12px;
          color: var(--accent-gold);
          font-weight: 600;
          font-size: 0.82rem;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }

        .price-field {
          flex: 1;
          min-width: 0;
          border-radius: 0;
          font-weight: 700;
          color: var(--accent-green);
        }

        .price-field:focus {
          box-shadow: none;
        }

        .price-input-wrapper:focus-within .price-prefix,
        .price-input-wrapper:focus-within .price-suffix {
          border-color: var(--accent-gold);
          box-shadow: 0 0 12px rgba(229, 193, 88, 0.1);
        }

        .form-textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          resize: vertical;
          min-height: 72px;
          transition: border-color 0.2s ease;
          width: 100%;
        }

        .form-textarea:focus {
          outline: none;
          border-color: var(--accent-gold);
          box-shadow: 0 0 12px rgba(229, 193, 88, 0.1);
        }

        .form-textarea::placeholder {
          color: var(--text-muted);
        }

        .links-manager {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .link-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .link-title-input {
          width: 120px;
          flex-shrink: 0;
        }

        .link-url-input {
          flex: 1;
          min-width: 0;
        }

        .btn-remove-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-remove-link:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .btn-add-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px dashed var(--glass-border);
          background: transparent;
          color: var(--accent-gold);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-add-link:hover {
          border-color: var(--accent-gold);
          background: rgba(229, 193, 88, 0.06);
        }
      `}</style>
    </div>
  );
}
