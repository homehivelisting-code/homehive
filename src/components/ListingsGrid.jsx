import { useState, useMemo } from 'react';
import {
  Bed, Bath, Car, Maximize, MapPin, Home, User, FileText,
  Compass, Edit3, Trash2, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

const statusConfig = {
  Available: { class: 'status-available', color: '#34d399' },
  Hold: { class: 'status-hold', color: '#fbbf24' },
  Sold: { class: 'status-sold', color: '#ef4444' },
};

const categoryConfig = {
  Sale: { class: 'category-sale', color: '#3b82f6' },
  Lease: { class: 'category-lease', color: '#8b5cf6' },
};

const typeConfig = {
  House: { class: 'type-house', icon: '🏠' },
  Unit: { class: 'type-unit', icon: '🏢' },
  Apartment: { class: 'type-apartment', icon: '🏬' },
};

const listingStyleConfig = {
  'Off-Market': { class: 'style-off-market', color: '#f97316' },
  Exclusive: { class: 'style-exclusive', color: '#06b6d4' },
};

function formatPrice(price, category) {
  if (price == null || price === '') return '-';
  const formatted = typeof price === 'number' ? price.toLocaleString() : price;
  if (category === 'Lease') {
    return `$${formatted}/wk`;
  }
  return `$${formatted}`;
}

function NotesSection({ notes }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = notes && notes.length > 80;

  if (!notes) return null;

  return (
    <div className="listing-notes">
      <div className="listing-notes-content">
        {expanded ? notes : (isLong ? `${notes.substring(0, 80)}...` : notes)}
      </div>
      {isLong && (
        <button
          className="listing-notes-toggle"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
}

export default function ListingsGrid({ listings, searchQuery = '', onEdit, onDelete, filters = {}, onFilterChange }) {
  const filteredListings = useMemo(() => {
    if (!searchQuery) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter((listing) => {
      const searchable = [
        listing.title,
        listing.address,
        listing.type,
        listing.aspect,
        listing.status,
        listing.listedBy,
        listing.notes,
        listing.listingStyle,
        String(listing.price),
        String(listing.beds),
        String(listing.baths),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [listings, searchQuery]);

  if (filteredListings.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.5 }}>🏠</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No listings found</div>
      </div>
    );
  }

  return (
    <div className="listings-grid">
      {filteredListings.map((listing) => {
        const status = statusConfig[listing.status] || statusConfig.Available;
        const category = categoryConfig[listing.category] || categoryConfig.Sale;
        const type = typeConfig[listing.type] || typeConfig.Apartment;
        const listingStyle = listingStyleConfig[listing.listingStyle] || listingStyleConfig.Exclusive;

        return (
          <div
            key={listing.id}
            className="listing-card glass-panel"
          >
            {/* Top row: Category + Status badges */}
            <div className="listing-card-top-row">
              <span className={`listing-badge ${category.class}`}>
                {listing.category}
              </span>
              <span className={`status-badge ${status.class}`}>
                {listing.status}
              </span>
            </div>

            {/* Title */}
            <div className="listing-card-title">{listing.title}</div>

            {/* Address */}
            <div className="listing-card-address">
              <MapPin size={13} className="listing-address-icon" />
              <span>{listing.address}</span>
            </div>

            {/* Type badge */}
            <div className="listing-card-type-row">
              <span className={`listing-badge type-badge ${type.class}`}>
                <span>{type.icon}</span> {listing.type}
              </span>
              {listing.listingStyle && (
                <span className={`listing-badge style-badge ${listingStyle.class}`}>
                  {listing.listingStyle}
                </span>
              )}
            </div>

            {/* Key stats row */}
            <div className="listing-card-stats">
              <div className="listing-stat">
                <Bed size={14} className="listing-stat-icon" />
                <span className="listing-stat-value">{listing.beds}</span>
                <span className="listing-stat-label">Beds</span>
              </div>
              <div className="listing-stat">
                <Bath size={14} className="listing-stat-icon" />
                <span className="listing-stat-value">{listing.baths}</span>
                <span className="listing-stat-label">Baths</span>
              </div>
              <div className="listing-stat">
                <Car size={14} className="listing-stat-icon" />
                <span className="listing-stat-value">{listing.cars}</span>
                <span className="listing-stat-label">Cars</span>
              </div>
            </div>

            {/* Size info */}
            <div className="listing-card-sizes">
              <div className="listing-size-item">
                <Maximize size={12} className="listing-size-icon" />
                <span>{listing.livingSize}m² living</span>
              </div>
              {listing.type === 'House' && listing.landSize && (
                <div className="listing-size-item">
                  <Maximize size={12} className="listing-size-icon land" />
                  <span>{listing.landSize}m² land</span>
                </div>
              )}
              {listing.houseArea && listing.houseArea !== listing.livingSize && (
                <div className="listing-size-item">
                  <Home size={12} className="listing-size-icon" />
                  <span>{listing.houseArea}m² area</span>
                </div>
              )}
            </div>

            {/* Aspect */}
            <div className="listing-card-aspect">
              <Compass size={14} className="listing-aspect-icon" />
              <span>{listing.aspect}</span>
            </div>

            {/* Price */}
            <div className="listing-card-price">
              {formatPrice(listing.price, listing.category)}
            </div>

            {/* Listed By */}
            <div className="listing-card-agent">
              <User size={12} />
              <span>{listing.listedBy}</span>
            </div>

            {/* Notes */}
            <NotesSection notes={listing.notes} />

            {/* Links */}
            {listing.links && listing.links.length > 0 && (
              <div className="listing-card-links">
                {listing.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="listing-card-link-tag"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={11} />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="listing-card-divider" />

            {/* Actions */}
            <div className="listing-card-actions">
              <button
                className="listing-action-btn listing-action-edit"
                onClick={(e) => { e.stopPropagation(); onEdit(listing); }}
                title="Edit Listing"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                className="listing-action-btn listing-action-delete"
                onClick={(e) => { e.stopPropagation(); onDelete(listing.id); }}
                title="Delete Listing"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
