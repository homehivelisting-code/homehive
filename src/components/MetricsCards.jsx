import { useMemo } from 'react';
import { Home, CheckCircle, Pause } from 'lucide-react';

export default function MetricsCards({ listings, category = 'Sale' }) {
  const metrics = useMemo(() => {
    const filtered = listings.filter(l => l.category === category);
    const total = filtered.length;
    const available = filtered.filter(l => l.status === 'Available').length;
    const holdOrSold = filtered.filter(l => l.status === 'Hold' || l.status === 'Sold').length;

    return { total, available, holdOrSold };
  }, [listings, category]);

  return (
    <div className="metrics-grid">
      <div className="glass-panel metric-card">
        <div className="metric-icon" style={{ background: 'rgba(229, 193, 88, 0.12)', color: '#e5c158' }}>
          <Home size={20} />
        </div>
        <div className="metric-label">Total Listings</div>
        <div className="metric-value">{metrics.total}</div>
        <div className="metric-change positive">{category} category</div>
      </div>

      <div className="glass-panel metric-card">
        <div className="metric-icon" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34d399' }}>
          <CheckCircle size={20} />
        </div>
        <div className="metric-label">Available</div>
        <div className="metric-value">{metrics.available}</div>
        <div className="metric-change positive">{metrics.total > 0 ? `${Math.round((metrics.available / metrics.total) * 100)}% availability` : 'No listings'}</div>
      </div>

      <div className="glass-panel metric-card">
        <div className="metric-icon" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
          <Pause size={20} />
        </div>
        <div className="metric-label">On Hold / Sold</div>
        <div className="metric-value">{metrics.holdOrSold}</div>
        <div className="metric-change positive">{metrics.total > 0 ? `${Math.round((metrics.holdOrSold / metrics.total) * 100)}% of listings` : 'No listings'}</div>
      </div>
    </div>
  );
}
