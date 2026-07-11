import { useState } from 'react';
import { X, Palette } from 'lucide-react';
import { colourSchemes } from '../data';

export default function ColourSchemeModal({ show, onClose, listing }) {
  const [selectedScheme, setSelectedScheme] = useState(null);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Palette size={18} style={{ marginRight: 8, verticalAlign: -2 }} />
            Colour Schemes
            {listing && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 8 }}>
              — Residence {listing.residence}
            </span>}
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="colour-schemes-grid">
            {colourSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`colour-scheme-card ${selectedScheme === scheme.id ? 'selected' : ''}`}
                onClick={() => setSelectedScheme(scheme.id)}
              >
                <div className="colour-scheme-name">{scheme.name}</div>
                <div className="colour-scheme-desc">{scheme.description}</div>
                <div className="colour-swatches">
                  {scheme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="colour-swatch"
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button
            className="btn btn-primary"
            disabled={!selectedScheme}
            style={{ opacity: selectedScheme ? 1 : 0.5 }}
          >
            Apply Scheme
          </button>
        </div>
      </div>
    </div>
  );
}
