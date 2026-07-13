import { useState } from 'react';
import { Edit3, Trash2, ExternalLink, Filter, X } from 'lucide-react';

const statusConfig = {
  Available: { label: 'Available', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  Hold: { label: 'Hold', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  Sold: { label: 'Sold', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  'Under Contract': { label: 'Under Contract', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

const listingStyleConfig = {
  'Off-Market': { label: 'Off-Market', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  Exclusive: { label: 'Exclusive', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
};

export default function ListingsTable({
  listings = [],
  onEdit,
  onDelete,
  searchQuery = '',
  statusFilter = '',
  filters = {},
  onFilterChange,
  category = 'Sale',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortValue = (listing, key) => {
    switch (key) {
      case 'type': return listing.type || '';
      case 'beds': return listing.beds ?? 0;
      case 'baths': return listing.baths ?? 0;
      case 'cars': return listing.cars ?? 0;
      case 'livingSize': return listing.livingSize ?? 0;
      case 'landSize': return listing.landSize ?? 0;
      case 'houseArea': return listing.houseArea ?? 0;
      case 'address': return listing.address || '';
      case 'aspect': return listing.aspect || '';
      case 'price': return listing.price ?? 0;
      case 'status': return listing.status || '';
      case 'listedBy': return listing.listedBy || listing.contactPerson || '';
      default: return '';
    }
  };

  const sortedListings = [...listings].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = getSortValue(a, sortConfig.key);
    const bVal = getSortValue(b, sortConfig.key);
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const cmp = String(aVal).localeCompare(String(bVal));
    return sortConfig.direction === 'asc' ? cmp : -cmp;
  });

  const filteredListings = sortedListings.filter((listing) => {
    if (statusFilter && listing.status !== statusFilter) return false;
    return true;
  });

  const formatPrice = (price, listingType) => {
    if (price == null || price === '') return '-';
    const formatted = typeof price === 'number' ? price.toLocaleString() : price;
    if (listingType === 'Lease') {
      return `$${formatted}/wk`;
    }
    return `$${formatted}`;
  };

  const formatSize = (val) => {
    if (val == null || val === '') return '-';
    return `${val} m²`;
  };

  const SortHeader = ({ label, sortKey, style = {} }) => {
    const isSorted = sortConfig.key === sortKey;
    return (
      <th
        className={isSorted ? 'sorted' : ''}
        onClick={() => handleSort(sortKey)}
        style={{ cursor: 'pointer', userSelect: 'none', ...style }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {label}
          <span className="sort-arrow" style={{ fontSize: '10px', opacity: isSorted ? 1 : 0.4 }}>
            {isSorted ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
          </span>
        </span>
      </th>
    );
  };

  return (
    <div className="glass-panel table-container">
      <div className="table-toolbar">
        <button
          className="filter-toggle-btn"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-label="Toggle filters"
        >
          {filtersOpen ? <X size={14} /> : <Filter size={14} />}
          <span>Filters</span>
        </button>
        <div className={`table-filters ${filtersOpen ? 'open' : ''}`}>
          <select
            className="filter-select"
            value={filters.status || ''}
            onChange={(e) => onFilterChange?.('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Hold">Hold</option>
            <option value="Sold">Sold</option>
            <option value="Under Contract">Under Contract</option>
          </select>
          <select
            className="filter-select"
            value={filters.propertyType || ''}
            onChange={(e) => onFilterChange?.('propertyType', e.target.value)}
          >
            <option value="">All Property Types</option>
            <option value="House">House</option>
            <option value="Unit">Unit</option>
            <option value="Apartment">Apartment</option>
          </select>
          <select
            className="filter-select"
            value={filters.listedBy || ''}
            onChange={(e) => onFilterChange?.('listedBy', e.target.value)}
          >
            <option value="">All Agents</option>
            <option value="Mahadev Dhanuk">Mahadev Dhanuk</option>
            <option value="Sajjan Sharma">Sajjan Sharma</option>
            <option value="Laxman Sanjyal">Laxman Sanjyal</option>
            <option value="Babbu Yadhav">Babbu Yadhav</option>
            <option value="Nilam Acharya">Nilam Acharya</option>
          </select>
          <select
            className="filter-select"
            value={filters.listingStyle || ''}
            onChange={(e) => onFilterChange?.('listingStyle', e.target.value)}
          >
            <option value="">All Listing Styles</option>
            <option value="Off-Market">Off-Market</option>
            <option value="Exclusive">Exclusive</option>
          </select>
        </div>
      </div>

      <div className="table-scroll-wrapper">
        <table className="listings-table">
          <thead>
            {category === 'Development' ? (
              <>
                <tr>
                  <th rowSpan={2} style={{ width: '50px', verticalAlign: 'middle' }}>S/N</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '200px' }}>Address</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Suburb</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Estate</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Est. Completion</th>
                  <th colSpan={5} style={{ textAlign: 'center', borderBottom: '1px solid var(--accent-gold)' }}>Property Details</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Loan Agreement</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Price</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Yield</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Status</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Brochure</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle', width: '100px' }}>Actions</th>
                </tr>
                <tr>
                  <SortHeader label="House Size" sortKey="houseSize" />
                  <SortHeader label="Beds" sortKey="beds" />
                  <SortHeader label="Baths" sortKey="baths" />
                  <SortHeader label="Cars" sortKey="cars" />
                  <SortHeader label="Land Size" sortKey="landSize" />
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th rowSpan={2} style={{ width: '50px', verticalAlign: 'middle' }}>S/N</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '200px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Address
                    </span>
                  </th>
                  <th colSpan={6} style={{ textAlign: 'center', borderBottom: '1px solid var(--accent-gold)' }}>
                    Description
                  </th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Aspect</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Price</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Status</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Listed By</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '120px' }}>Notes</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle', minWidth: '140px' }}>Links</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle' }}>Listing Style</th>
                  <th rowSpan={2} style={{ verticalAlign: 'middle', width: '100px' }}>Actions</th>
                </tr>
                <tr>
                  <SortHeader label="Type" sortKey="type" />
                  <SortHeader label="Beds" sortKey="beds" />
                  <SortHeader label="Baths" sortKey="baths" />
                  <SortHeader label="Cars" sortKey="cars" />
                  <SortHeader label="Living Size" sortKey="livingSize" />
                  <SortHeader label="Land Size" sortKey="landSize" />
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {filteredListings.map((listing, index) => {
              const isApartmentOrUnit = /apartment|unit/i.test(listing.type || '');
              const statusCfg = statusConfig[listing.status] || statusConfig.Available;
              const styleCfg = listing.listingStyle ? listingStyleConfig[listing.listingStyle] : null;

              if (category === 'Development') {
                return (
                  <tr key={listing.id || index}>
                    <td className="sn-cell">{index + 1}</td>
                    <td className="address-cell" title={listing.address}>
                      {listing.address || '-'}
                    </td>
                    <td>{listing.suburb || '-'}</td>
                    <td>{listing.estate || '-'}</td>
                    <td style={{ fontSize: '0.74rem' }}>{listing.estimatedCompletionDate || '-'}</td>
                    <td>{listing.houseSize ?? '-'}</td>
                    <td>{listing.beds ?? '-'}</td>
                    <td>{listing.baths ?? '-'}</td>
                    <td>{listing.cars ?? '-'}</td>
                    <td>{listing.landSize ? formatSize(listing.landSize) : '-'}</td>
                    <td>{listing.loanAgreementRequired ? 'YES' : 'NO'}</td>
                    <td className="price-cell">
                      {formatPrice(listing.price, listing.category)}
                    </td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--accent-green)' }}>{listing.rentalYield || '-'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: statusCfg.color,
                          backgroundColor: statusCfg.bg,
                          border: `1px solid ${statusCfg.color}33`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.74rem' }}>{listing.brochure || '-'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" onClick={() => onEdit?.(listing)}>
                          <Edit3 size={15} />
                          <span className="tooltip">Edit</span>
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => {
                            if (window.confirm(`Delete listing at "${listing.address}"?`)) {
                              onDelete?.(listing.id);
                            }
                          }}
                        >
                          <Trash2 size={15} style={{ color: '#ef4444' }} />
                          <span className="tooltip">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={listing.id || index}>
                  <td className="sn-cell">{index + 1}</td>

                  <td className="address-cell" title={listing.address}>
                    {listing.address || '-'}
                  </td>

                  <td className="type-cell">{listing.type || '-'}</td>
                  <td>{listing.beds ?? '-'}</td>
                  <td>{listing.baths ?? '-'}</td>
                  <td>{listing.cars ?? '-'}</td>
                  <td>{formatSize(listing.livingSize)}</td>
                  <td>{isApartmentOrUnit ? '-' : formatSize(listing.landSize)}</td>

                  <td>{listing.aspect || '-'}</td>

                  <td className="price-cell">
                    {formatPrice(listing.price, listing.listingType || listing.type)}
                  </td>

                  <td>
                    <span
                      className="status-badge"
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: statusCfg.color,
                        backgroundColor: statusCfg.bg,
                        border: `1px solid ${statusCfg.color}33`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {listing.listedBy || listing.contactPerson || '-'}
                  </td>

                  <td
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-secondary)',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={listing.notes || ''}
                  >
                    {listing.notes || '-'}
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {listing.links && listing.links.length > 0 ? (
                        listing.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              color: '#e5c158',
                              backgroundColor: 'rgba(229, 193, 88, 0.12)',
                              border: '1px solid rgba(229, 193, 88, 0.2)',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'rgba(229, 193, 88, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'rgba(229, 193, 88, 0.12)';
                            }}
                          >
                            <ExternalLink size={10} />
                            {link.title}
                          </a>
                        ))
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>-</span>
                      )}
                    </div>
                  </td>

                  <td>
                    {styleCfg ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: styleCfg.color,
                          backgroundColor: styleCfg.bg,
                          border: `1px solid ${styleCfg.color}33`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {styleCfg.label}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>-</span>
                    )}
                  </td>

                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => onEdit?.(listing)}>
                        <Edit3 size={15} />
                        <span className="tooltip">Edit</span>
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => {
                          if (window.confirm(`Delete listing at "${listing.address}"?`)) {
                            onDelete?.(listing.id);
                          }
                        }}
                      >
                        <Trash2 size={15} style={{ color: '#ef4444' }} />
                        <span className="tooltip">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredListings.length === 0 && (
              <tr>
                <td
                  colSpan={15}
                  style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}
                >
                  No listings match your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
