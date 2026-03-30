// ═══════════════════════════════════════════════════════════════════════════
//  DATA CONSTANTS — Single source of truth for all static app data
// ═══════════════════════════════════════════════════════════════════════════

import SamosaImg from '../assets/Images/Samosa.jpg';
import ColdCoffeeImg from '../assets/Images/ColdCoffee.jpg';
import VadaPavImg from '../assets/Images/VadaPav.jpg';
import GrilledSandwichImg from '../assets/Images/GrilledSandwich.jpg';
import MasalaChaiImg from '../assets/Images/MasalaChai.jpg';
import PaneerWrapImg from '../assets/Images/PaneerWrap.jpg';
import PavBhajiImg from '../assets/Images/PavBhaji.jpg';
import LimeSodaImg from '../assets/Images/LimeSoda.jpg';
import PohaImg from '../assets/Images/Poha.jpg';
import MangoLassiImg from '../assets/Images/MangoLassi.jpg';

export const COLLEGES = [
  {
    id: 9,
    name: 'Indus University',
    short: 'IU',
    canteen: 'Indus Food Court',
    emoji: '🏫',
    color: 'linear-gradient(135deg,#3B82F6,#1E40AF)',
    students: '5,000+',
    area: 'Rancharda, Ahmedabad',
    timing: '8:30AM–6PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509952597phpuIGaUP.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/1296/1296-400.jpg"
  },
  {
    id: 10,
    name: 'GEC Gandhinagar',
    short: 'GEC',
    canteen: 'GEC Canteen — Block 4',
    emoji: '🏛️',
    color: 'linear-gradient(135deg,#10B981,#059669)',
    students: '4,500+',
    area: 'Sector-28, Gandhinagar',
    timing: '8AM–7PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509952383phpkAIJVa.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/2604/2604-400.jpg"
  },
  {
    id: 2,
    name: 'LD College of Engineering',
    short: 'LDCE',
    canteen: 'LDCE Central Canteen',
    emoji: '⚙️',
    color: 'linear-gradient(135deg,#1D4ED8,#1E40AF)',
    students: '5,800+',
    area: 'University Area, Ahmedabad',
    timing: '7:30AM–8PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509951765phpkHaFaR.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/38192/38192-400.jpg"
  },
  {
    id: 1,
    name: 'NIRMA University',
    short: 'NIRMA',
    canteen: 'NIRMA Food Court — Block C',
    emoji: '🎓',
    color: 'linear-gradient(135deg,#DC2626,#B91C1C)',
    students: '8,200+',
    area: 'Sarkhej–Gandhinagar Hwy',
    timing: '8AM–9PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1488523326phpaWkFsw.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/1206/1206-400.jpg"
  },
  {
    id: 3,
    name: 'DA-IICT',
    short: 'DAIICT',
    canteen: 'DAIICT Mess & Café',
    emoji: '💻',
    color: 'linear-gradient(135deg,#0D9488,#0F766E)',
    students: '3,200+',
    area: 'Gandhinagar',
    timing: '8AM–10PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509952175phpU5SPhY.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/2513/2513-400.jpg"
  },
  {
    id: 4,
    name: 'Gujarat University',
    short: 'GU',
    canteen: 'GU Central Canteen',
    emoji: '🏛️',
    color: 'linear-gradient(135deg,#D97706,#B45309)',
    students: '22,000+',
    area: 'Navrangpura',
    timing: '7AM–8PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509951664phpA8msh9.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/2196/2196-400.jpg"
  },
  {
    id: 5,
    name: 'CEPT University',
    short: 'CEPT',
    canteen: 'CEPT Studio Café',
    emoji: '🏗️',
    color: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
    students: '2,800+',
    area: 'University Road',
    timing: '9AM–9PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509952044phpe76oYJ.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/1252/1252-400.jpg"
  },
  {
    id: 6,
    name: 'Ahmedabad University',
    short: 'AU',
    canteen: 'AU Central Dining Hall',
    emoji: '🎯',
    color: 'linear-gradient(135deg,#059669,#047857)',
    students: '4,500+',
    area: 'Navrangpura',
    timing: '7:30AM–9PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509951865php27aOaW.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/2246/2246-400.jpg"
  },
  {
    id: 7,
    name: 'IIM Ahmedabad',
    short: 'IIMA',
    canteen: 'IIMA Dhaba',
    emoji: '📊',
    color: 'linear-gradient(135deg,#9333EA,#7E22CE)',
    students: '1,400+',
    area: 'Vastrapur',
    timing: '6AM–11PM',
    photoUrl: "https://images.shiksha.com/mediadata/images/1509951944phpV4S9wN.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/1199/1199-400.jpg"
  },
  {
    id: 8,
    name: 'JG University',
    short: 'JGU',
    canteen: 'JGU Canteen',
    emoji: '🏫',
    color: 'linear-gradient(135deg,#6B7280,#4B5563)',
    students: '2,000+',
    area: 'Ahmedabad',
    timing: '8AM–6PM',
    locked: true,
    photoUrl: "https://images.shiksha.com/mediadata/images/1509952478phpXpTzYa.jpeg",
    fallbackUrl: "https://www.collegebatch.com/static/clg-photos/2646/2646-400.jpg"
  },
];

export const FOOD = [
  {
    id: 1, name: 'Special Samosa', cat: 'Snacks', price: 25, rating: 4.8, votes: '2.3k', time: 5, cal: 180, tag: 'Bestseller',
    veg: true, emoji: '🥟', desc: 'Crispy gold pastry stuffed with spiced potato & green peas',
    img: SamosaImg,
    g: 'linear-gradient(135deg,#f97316,#ef4444)',
    proof: { orders: 47, viewers: 3, low: false },
  },
  {
    id: 2, name: 'Cold Coffee', cat: 'Drinks', price: 60, rating: 4.9, votes: '1.8k', time: 3, cal: 220, tag: 'Fan Fav ❤️',
    veg: true, emoji: '☕', desc: 'Thick cold brew with chocolate drizzle & whipped cream',
    img: ColdCoffeeImg,
    g: 'linear-gradient(135deg,#78350f,#1c0a00)',
    proof: { orders: 31, viewers: 5, low: false },
  },
  {
    id: 3, name: 'Vada Pav', cat: 'Snacks', price: 20, rating: 4.7, votes: '3.1k', time: 4, cal: 150, tag: 'Classic',
    veg: true, emoji: '🍔', desc: "Mumbai's legendary street burger with green & tamarind chutneys",
    img: VadaPavImg,
    g: 'linear-gradient(135deg,#d97706,#92400e)',
    proof: { orders: 62, viewers: 2, low: false },
  },
  {
    id: 4, name: 'Grilled Sandwich', cat: 'Combos', price: 80, rating: 4.9, votes: '987', time: 8, cal: 380, tag: '🔥 Hot',
    veg: true, emoji: '🥪', desc: 'Double molten cheddar with fresh veggies on toasted rustic bread',
    img: GrilledSandwichImg,
    g: 'linear-gradient(135deg,#f59e0b,#d97706)',
    proof: { orders: 18, viewers: 4, low: true },
  },
  {
    id: 5, name: 'Masala Chai', cat: 'Drinks', price: 15, rating: 4.6, votes: '4.5k', time: 2, cal: 80, tag: '⚡ Quick',
    veg: true, emoji: '🍵', desc: 'Aromatic ginger-cardamom brew steeped to perfection',
    img: MasalaChaiImg,
    g: 'linear-gradient(135deg,#ef4444,#dc2626)',
    proof: { orders: 88, viewers: 6, low: false },
  },
  {
    id: 6, name: 'Paneer Wrap', cat: 'Combos', price: 75, rating: 4.8, votes: '654', time: 7, cal: 320, tag: 'Filling',
    veg: true, emoji: '🌯', desc: 'Creamy tikka paneer stuffed in a soft warm roti wrap',
    img: PaneerWrapImg,
    g: 'linear-gradient(135deg,#22c55e,#16a34a)',
    proof: { orders: 23, viewers: 2, low: false },
  },
  {
    id: 7, name: 'Pav Bhaji', cat: 'Combos', price: 55, rating: 4.7, votes: '1.9k', time: 10, cal: 420, tag: '🌶️ Spicy',
    veg: true, emoji: '🍛', desc: 'Mumbai-style spicy mashed veggie curry with buttered pav',
    img: PavBhajiImg,
    g: 'linear-gradient(135deg,#ef4444,#f97316)',
    proof: { orders: 39, viewers: 3, low: false },
  },
  {
    id: 8, name: 'Fresh Lime Soda', cat: 'Drinks', price: 30, rating: 4.5, votes: '789', time: 2, cal: 45, tag: 'Refreshing',
    veg: true, emoji: '🥤', desc: 'Chilled fizzy lime soda with a perfectly salted rim',
    img: LimeSodaImg,
    g: 'linear-gradient(135deg,#84cc16,#16a34a)',
    proof: { orders: 14, viewers: 1, low: false },
  },
  {
    id: 9, name: 'Poha', cat: 'Snacks', price: 30, rating: 4.6, votes: '1.2k', time: 6, cal: 210, tag: 'Morning Pick',
    veg: true, emoji: '🍚', desc: 'Light & fluffy flattened rice with peanuts, curry leaves & lemon',
    img: PohaImg,
    g: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
    proof: { orders: 29, viewers: 2, low: false },
  },
  {
    id: 10, name: 'Mango Lassi', cat: 'Drinks', price: 50, rating: 4.8, votes: '2.1k', time: 3, cal: 260, tag: 'Summer Love',
    veg: true, emoji: '🥭', desc: 'Thick creamy mango blended with chilled yogurt & saffron',
    img: MangoLassiImg,
    g: 'linear-gradient(135deg,#f59e0b,#d97706)',
    proof: { orders: 41, viewers: 4, low: true },
  },
];

export const BANNERS = [
  { id: 1, title: '🎓 College Special', sub: 'Extra 20% off all combos today!', code: 'COLLEGE20', cta: 'GRAB DEAL', bg: 'linear-gradient(135deg,#FF6B35 0%,#FF3D60 70%)', e: '🍔' },
  { id: 2, title: '⚡ Lightning Deal', sub: 'Samosa + Chai bundle just ₹35', code: 'QUICK10', cta: 'ORDER NOW', bg: 'linear-gradient(135deg,#7C3AED 0%,#4C1D95 80%)', e: '⚡' },
  { id: 3, title: '🎁 Weekend Fiesta', sub: 'Free dessert on orders above ₹100', code: 'FREE100', cta: 'CLAIM IT', bg: 'linear-gradient(135deg,#059669 0%,#064E3B 80%)', e: '🎁' },
  { id: 4, title: '🌅 Morning Rush', sub: 'Breakfast combo from just ₹45', code: 'MORNING15', cta: 'EAT NOW', bg: 'linear-gradient(135deg,#D97706 0%,#92400E 80%)', e: '☀️' },
];

export const CATS = ['All', 'Snacks', 'Drinks', 'Combos'];
export const SORTS = ['Relevance', 'Rating ↓', 'Price ↑', 'Price ↓', 'Fastest'];
export const COUPONS = { QUICK10: 10, COLLEGE20: 20, MORNING15: 15, FREE100: 0 };
export const PREP_FEE = 5;
export const MAX_QTY = 20;

export const AVATAR_GRAD = [
  'linear-gradient(135deg,#FF6B35,#FF3D60)',
  'linear-gradient(135deg,#7C3AED,#6D28D9)',
  'linear-gradient(135deg,#0891B2,#0E7490)',
  'linear-gradient(135deg,#16A34A,#15803D)',
  'linear-gradient(135deg,#D97706,#B45309)',
];


