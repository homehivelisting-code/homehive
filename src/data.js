import { supabase } from './supabase';

export const agents = [
  { id: 1, name: "Mahadev Dhanuk", avatar: "MD", color: "#d4af37" },
  { id: 2, name: "Sajjan Sharma", avatar: "SS", color: "#e5c158" },
  { id: 3, name: "Laxman Sanjyal", avatar: "LS", color: "#f0d476" },
  { id: 4, name: "Babbu Yadhav", avatar: "BY", color: "#c9a52a" },
  { id: 5, name: "Nilam Acharya", avatar: "NA", color: "#b8941e" },
];

const mapRowToListing = (row) => ({
  id: row.id,
  category: row.category,
  title: row.title,
  address: row.address,
  type: row.type,
  beds: row.beds,
  baths: row.baths,
  cars: row.cars,
  livingSize: row.living_size,
  landSize: row.land_size,
  houseArea: row.house_area,
  houseSize: row.house_size,
  aspect: row.aspect,
  price: row.price,
  status: row.status,
  listedBy: row.listed_by,
  notes: row.notes,
  links: row.links || [],
  listingStyle: row.listing_style,
  suburb: row.suburb,
  estate: row.estate,
  loanAgreementRequired: row.loan_agreement_required,
  estimatedCompletionDate: row.estimated_completion_date,
  rentalYield: row.rental_yield,
  brochure: row.brochure,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapListingToRow = (listing) => ({
  id: listing.id,
  category: listing.category,
  title: listing.title,
  address: listing.address,
  type: listing.type,
  beds: listing.beds,
  baths: listing.baths,
  cars: listing.cars,
  living_size: listing.livingSize,
  land_size: listing.landSize,
  house_area: listing.houseArea,
  house_size: listing.houseSize,
  aspect: listing.aspect,
  price: listing.price,
  status: listing.status,
  listed_by: listing.listedBy,
  notes: listing.notes,
  links: listing.links,
  listing_style: listing.listingStyle,
  suburb: listing.suburb,
  estate: listing.estate,
  loan_agreement_required: listing.loanAgreementRequired,
  estimated_completion_date: listing.estimatedCompletionDate,
  rental_yield: listing.rentalYield,
  brochure: listing.brochure,
});

export async function fetchListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching listings:', error);
    return [];
  }

  return data.map(mapRowToListing);
}

export async function addListing(listing) {
  const row = mapListingToRow(listing);
  const { data, error } = await supabase
    .from('listings')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('Error adding listing:', error);
    return null;
  }

  return mapRowToListing(data);
}

export async function updateListing(id, updates) {
  const row = mapListingToRow({ ...updates, id });
  const { data, error } = await supabase
    .from('listings')
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating listing:', error);
    return null;
  }

  return mapRowToListing(data);
}

export async function deleteListing(id) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting listing:', error);
    return false;
  }

  return true;
}

export function getListingBadges(listing) {
  const badges = [];
  const HOURS_NEW = 72; // Show "Brand New" for 72 hours
  const HOURS_UPDATED = 48; // Show "Updated" for 48 hours

  const now = new Date();
  const createdAt = listing.createdAt ? new Date(listing.createdAt) : null;
  const updatedAt = listing.updatedAt ? new Date(listing.updatedAt) : null;

  if (createdAt) {
    const hoursSinceCreated = (now - createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreated < HOURS_NEW) {
      badges.push({ label: 'Brand New', type: 'new' });
    }
  }

  if (updatedAt && createdAt) {
    const hoursSinceUpdated = (now - updatedAt) / (1000 * 60 * 60);
    const wasActuallyUpdated = (updatedAt - createdAt) > 60 * 1000; // > 1 min diff
    if (wasActuallyUpdated && hoursSinceUpdated < HOURS_UPDATED) {
      badges.push({ label: 'Updated', type: 'updated' });
    }
  }

  return badges;
}

export const colourSchemes = [
  {
    id: "warm-wood",
    name: "Warm Wood",
    description: "Rich timber tones with warm earth accents. Perfect for creating a cosy, inviting atmosphere that connects with nature.",
    colors: ["#8B4513", "#D2691E", "#DEB887", "#F5DEB3", "#FFFAF0"],
  },
  {
    id: "modern-concrete",
    name: "Modern Concrete",
    description: "Sleek industrial palette featuring raw concrete greys and steel accents. Ideal for contemporary urban living spaces.",
    colors: ["#2C3E50", "#5D6D7E", "#ABB2B9", "#E5E8E8", "#F8F9F9"],
  },
  {
    id: "minimalist-white",
    name: "Minimalist White",
    description: "Clean, bright whites with subtle warm undertones. Creates an airy, spacious feeling with timeless elegance.",
    colors: ["#2C3E50", "#7F8C8D", "#ECF0F1", "#FDFEFE", "#FFFFFF"],
  },
  {
    id: "industrial-dark",
    name: "Industrial Dark",
    description: "Bold charcoal and matte black tones with metallic highlights. A dramatic palette for statement interiors.",
    colors: ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"],
  },
];