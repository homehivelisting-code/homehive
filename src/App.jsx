import { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, LayoutGrid, Table, LogOut, Search, Menu, X, Lock } from 'lucide-react';
import { agents, fetchListings, addListing, updateListing, deleteListing } from './data';
import MetricsCards from './components/MetricsCards';
import ListingsTable from './components/ListingsTable';
import ListingsGrid from './components/ListingsGrid';
import AddEditPropertyModal from './components/AddEditPropertyModal';

import ColourSchemeModal from './components/ColourSchemeModal';
import './App.css';

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const APP_PASSWORD = '5555';

function PasswordGate({ onCorrect }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (value.length >= 4) return;
    const next = value + d;
    setValue(next);
    setError(false);
    if (next.length === 4) {
      if (next === APP_PASSWORD) {
        setTimeout(() => onCorrect(), 200);
      } else {
        setError(true);
        setTimeout(() => setValue(''), 600);
      }
    }
  };

  const handleBackspace = () => {
    setValue((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="login-screen">
      <div className="login-container" style={{ maxWidth: '380px' }}>
        <div className="login-brand">
          <img src="/logo.png" alt="HomeHive" className="login-logo" />
          <h1 className="login-title">HomeHive</h1>
          <p className="login-subtitle">Collaborative Property Management Dashboard</p>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), #f0d476)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Lock size={22} style={{ color: '#1a1a2e' }} />
          </div>
          <h2 className="login-prompt" style={{ marginBottom: 8 }}>Enter Passcode</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>4-digit code required to access the dashboard</p>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: 24,
        }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              width: 48, height: 58, borderRadius: 8,
              background: error ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
              border: `2px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700, color: '#fff',
              transition: 'all 0.15s ease',
            }}>
              {value[i] ? '●' : ''}
            </div>
          ))}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
          maxWidth: 240, margin: '0 auto',
        }}>
          {[1,2,3,4,5,6,7,8,9].map((d) => (
            <button key={d} onClick={() => handleDigit(String(d))} style={{
              height: 52, borderRadius: 10, border: 'none',
              background: 'rgba(255,255,255,0.08)', color: '#fff',
              fontSize: '1.3rem', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
            >
              {d}
            </button>
          ))}
          <button onClick={handleBackspace} style={{
            height: 52, borderRadius: 10, border: 'none',
            backgroundColor: 'transparent', color: 'var(--text-muted)',
            fontSize: '0.85rem', cursor: 'pointer',
          }}>
            ⌫
          </button>
          <button onClick={() => handleDigit('0')} style={{
            height: 52, borderRadius: 10, border: 'none',
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            fontSize: '1.3rem', fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
          >
            0
          </button>
          <div />
        </div>
        {error && (
          <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.8rem', marginTop: 16 }}>
            Incorrect passcode
          </p>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onSelectAgent }) {
  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-brand">
          <img src="/logo.png" alt="HomeHive" className="login-logo" />
          <h1 className="login-title">HomeHive</h1>
          <p className="login-subtitle">Collaborative Property Management Dashboard</p>
        </div>
        <h2 className="login-prompt">Select your agent profile</h2>
        <div className="agent-grid">
          {agents.map((agent) => (
            <button
              key={agent.id}
              className="agent-card glass-panel"
              onClick={() => onSelectAgent(agent)}
            >
              <div
                className="agent-avatar"
                style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)` }}
              >
                {agent.avatar}
              </div>
              <span className="agent-name">{agent.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [passwordEntered, setPasswordEntered] = useState(() => loadState('passwordEntered', false));
  const [currentAgent, setCurrentAgent] = useState(() => loadState('currentAgent', null));
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('Sale');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ beds: '', aspect: '', status: '', priceRange: '', propertyType: '', listedBy: '', listingStyle: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'address', direction: 'asc' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [showColourScheme, setShowColourScheme] = useState(false);
  const [colourSchemeListing, setColourSchemeListing] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchListings();
      setListings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handlePasswordCorrect = useCallback(() => {
    localStorage.setItem('passwordEntered', JSON.stringify(true));
    setPasswordEntered(true);
  }, []);

  const handleSelectAgent = useCallback((agent) => {
    localStorage.setItem('currentAgent', JSON.stringify(agent));
    setCurrentAgent(agent);
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('currentAgent');
    localStorage.removeItem('passwordEntered');
    setCurrentAgent(null);
    setPasswordEntered(false);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const tabListings = useMemo(() => {
    return listings.filter((l) => l.category === activeTab);
  }, [listings, activeTab]);

  const filteredListings = useMemo(() => {
    let result = [...tabListings];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.address.toLowerCase().includes(q) ||
          l.type.toLowerCase().includes(q) ||
          l.aspect.toLowerCase().includes(q) ||
          l.status.toLowerCase().includes(q) ||
          (l.exclusiveNumber && l.exclusiveNumber.toLowerCase().includes(q)) ||
          (l.contactPerson && l.contactPerson.toLowerCase().includes(q))
      );
    }

    if (filters.beds) result = result.filter((l) => l.beds === parseInt(filters.beds, 10));
    if (filters.aspect) result = result.filter((l) => l.aspect === filters.aspect);
    if (filters.status) result = result.filter((l) => l.status === filters.status);
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter((l) => l.price >= min && l.price <= max);
    }
    if (filters.propertyType) result = result.filter((l) => l.type === filters.propertyType);
    if (filters.listedBy) result = result.filter((l) => l.listedBy === filters.listedBy);
    if (filters.listingStyle) result = result.filter((l) => l.listingStyle === filters.listingStyle);

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [tabListings, searchQuery, filters, sortConfig]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleStatusChange = useCallback(async (id, newStatus) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    await updateListing(id, { status: newStatus });
  }, []);

  const handlePriceChange = useCallback(async (id, newPrice) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, price: newPrice } : l)));
    await updateListing(id, { price: newPrice });
  }, []);

  const handleAddEditSave = useCallback(async (formData) => {
    if (editingListing) {
      const updated = await updateListing(editingListing.id, formData);
      if (updated) {
        setListings((prev) => prev.map((l) => (l.id === editingListing.id ? updated : l)));
      }
    } else {
      const maxId = listings.length > 0 ? Math.max(...listings.map((l) => l.id)) : 0;
      const newListing = await addListing({ ...formData, id: maxId + 1 });
      if (newListing) {
        setListings((prev) => [...prev, newListing]);
      }
    }
    setEditingListing(null);
  }, [editingListing, listings]);

  const handleEdit = useCallback((listing) => {
    setEditingListing(listing);
    setShowAddEdit(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    const listing = listings.find((l) => l.id === id);
    if (listing && window.confirm(`Delete ${listing.address}?`)) {
      const success = await deleteListing(id);
      if (success) {
        setListings((prev) => prev.filter((l) => l.id !== id));
      }
    }
  }, [listings]);

  const handleCompare = useCallback((listing) => {
    setColourSchemeListing(listing);
    setShowColourScheme(true);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingListing(null);
    setShowAddEdit(true);
  }, []);

  if (!passwordEntered) {
    return <PasswordGate onCorrect={handlePasswordCorrect} />;
  }

  if (!currentAgent) {
    return <LoginScreen onSelectAgent={handleSelectAgent} />;
  }

  if (loading) {
    return (
      <div className="login-screen">
        <div className="login-container">
          <div className="login-brand">
            <img src="/logo.png" alt="HomeHive" className="login-logo" />
            <h1 className="login-title">HomeHive</h1>
            <p className="login-subtitle">Loading listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <img src="/logo.png" alt="HomeHive" className="header-logo" />
          <div>
            <h1 className="app-title">HomeHive</h1>
            <div className="app-subtitle">Collaborative Property Management Dashboard</div>
          </div>
        </div>
        <div className="header-search">
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="header-actions">
          <div className="header-agent">
            <div
              className="header-agent-avatar"
              style={{ background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)` }}
            >
              {currentAgent.avatar}
            </div>
            <span className="header-agent-name">{currentAgent.name}</span>
          </div>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <Table size={16} /> <span className="view-toggle-label">Table</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={16} /> <span className="view-toggle-label">Grid</span>
            </button>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span className="btn-label-desktop">Add Property</span>
            <span className="btn-label-mobile">Add</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            <LogOut size={14} />
            <span className="btn-label-desktop">Sign Out</span>
          </button>
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="header-agent">
                <div
                  className="header-agent-avatar"
                  style={{ background: `linear-gradient(135deg, ${currentAgent.color}, ${currentAgent.color}dd)` }}
                >
                  {currentAgent.avatar}
                </div>
                <span className="header-agent-name">{currentAgent.name}</span>
              </div>
            </div>
            <div className="mobile-menu-search">
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mobile-menu-actions">
              <button
                className={`mobile-menu-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => { setViewMode('table'); setMobileMenuOpen(false); }}
              >
                <Table size={16} /> Table View
              </button>
              <button
                className={`mobile-menu-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => { setViewMode('grid'); setMobileMenuOpen(false); }}
              >
                <LayoutGrid size={16} /> Grid View
              </button>
              <button className="mobile-menu-btn primary" onClick={() => { openAddModal(); setMobileMenuOpen(false); }}>
                <Plus size={16} /> Add Property
              </button>
              <button className="mobile-menu-btn danger" onClick={handleSignOut}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'Sale' ? 'active' : ''}`}
          onClick={() => setActiveTab('Sale')}
        >
          For Sale
        </button>
        <button
          className={`tab-btn ${activeTab === 'Lease' ? 'active' : ''}`}
          onClick={() => setActiveTab('Lease')}
        >
          For Lease
        </button>
        <button
          className={`tab-btn ${activeTab === 'Development' ? 'active' : ''}`}
          onClick={() => setActiveTab('Development')}
        >
          For Development
        </button>
      </div>

      <MetricsCards listings={listings} category={activeTab} />

      {viewMode === 'table' ? (
        <ListingsTable
          listings={filteredListings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filters={filters}
          onFilterChange={handleFilterChange}
          category={activeTab}
        />
      ) : (
        <ListingsGrid
          listings={filteredListings}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      <AddEditPropertyModal
        show={showAddEdit}
        onClose={() => { setShowAddEdit(false); setEditingListing(null); }}
        onSave={handleAddEditSave}
        editingListing={editingListing}
      />
      <ColourSchemeModal
        show={showColourScheme}
        onClose={() => { setShowColourScheme(false); setColourSchemeListing(null); }}
        listing={colourSchemeListing}
      />
    </div>
  );
}

export default App;