const express = require('express');
const router = express.Router();
const { analyzeDispatch } = require('./ai-engine');

// Coverage data per city zone
const cityZones = {
  Kigali: {
    'Kicukiro':   { signal: 'HIGH',   reliability: 0.95 },
    'Kimironko':  { signal: 'HIGH',   reliability: 0.90 },
    'Nyarugenge': { signal: 'MEDIUM', reliability: 0.70 },
    'Nyamirambo': { signal: 'MEDIUM', reliability: 0.75 },
    'Gasabo':     { signal: 'LOW',    reliability: 0.45 },
    'Remera':     { signal: 'HIGH',   reliability: 0.88 },
  },
  Nairobi: {
    'Westlands':  { signal: 'HIGH',   reliability: 0.93 },
    'CBD':        { signal: 'HIGH',   reliability: 0.91 },
    'Kibera':     { signal: 'LOW',    reliability: 0.40 },
    'Karen':      { signal: 'MEDIUM', reliability: 0.72 },
    'Eastleigh':  { signal: 'MEDIUM', reliability: 0.68 },
    'Parklands':  { signal: 'HIGH',   reliability: 0.89 },
  },
  Lagos: {
    'Victoria Island': { signal: 'HIGH',   reliability: 0.92 },
    'Ikeja':           { signal: 'HIGH',   reliability: 0.88 },
    'Surulere':        { signal: 'MEDIUM', reliability: 0.71 },
    'Lekki':           { signal: 'HIGH',   reliability: 0.90 },
    'Mushin':          { signal: 'LOW',    reliability: 0.42 },
    'Yaba':            { signal: 'MEDIUM', reliability: 0.75 },
  },
  Kampala: {
    'Kololo':    { signal: 'HIGH',   reliability: 0.91 },
    'Nakasero':  { signal: 'HIGH',   reliability: 0.89 },
    'Kawempe':   { signal: 'LOW',    reliability: 0.43 },
    'Makindye':  { signal: 'MEDIUM', reliability: 0.73 },
    'Ntinda':    { signal: 'HIGH',   reliability: 0.87 },
    'Kireka':    { signal: 'MEDIUM', reliability: 0.66 },
  },
  Accra: {
    'Airport Residential': { signal: 'HIGH',   reliability: 0.93 },
    'Osu':                 { signal: 'HIGH',   reliability: 0.90 },
    'Nima':                { signal: 'LOW',    reliability: 0.41 },
    'East Legon':          { signal: 'HIGH',   reliability: 0.92 },
    'Madina':              { signal: 'MEDIUM', reliability: 0.69 },
    'Tema':                { signal: 'MEDIUM', reliability: 0.74 },
  },
  'Dar es Salaam': {
    'Masaki':    { signal: 'HIGH',   reliability: 0.91 },
    'Kariakoo':  { signal: 'MEDIUM', reliability: 0.70 },
    'Kinondoni': { signal: 'HIGH',   reliability: 0.88 },
    'Temeke':    { signal: 'LOW',    reliability: 0.44 },
    'Ilala':     { signal: 'MEDIUM', reliability: 0.72 },
    'Mikocheni': { signal: 'HIGH',   reliability: 0.86 },
  },
};

// Drivers per city
const cityDrivers = {
  Kigali: [
    { id:1, name:'Jean-Paul M.', zone:'Kicukiro',   lat:-1.9706, lng:30.1044, phone:'+250781000001', operator:'MTN Rwanda' },
    { id:2, name:'Amina K.',     zone:'Kimironko',  lat:-1.9355, lng:30.1116, phone:'+250781000002', operator:'Airtel Rwanda' },
    { id:3, name:'Patrick N.',   zone:'Nyarugenge', lat:-1.9536, lng:30.0605, phone:'+250781000003', operator:'MTN Rwanda' },
    { id:4, name:'Grace U.',     zone:'Kicukiro',   lat:-1.9800, lng:30.1200, phone:'+250781000004', operator:'Airtel Rwanda' },
    { id:5, name:'David M.',     zone:'Gasabo',     lat:-1.9200, lng:30.1300, phone:'+250781000005', operator:'MTN Rwanda' },
    { id:6, name:'Olive R.',     zone:'Nyamirambo', lat:-1.9750, lng:30.0450, phone:'+250781000006', operator:'Airtel Rwanda' },
    { id:7, name:'Eric B.',      zone:'Remera',     lat:-1.9500, lng:30.1000, phone:'+250781000007', operator:'MTN Rwanda' },
    { id:8, name:'Sandrine T.',  zone:'Kicukiro',   lat:-1.9650, lng:30.1100, phone:'+250781000008', operator:'Airtel Rwanda' },
  ],
  Nairobi: [
    { id:1, name:'James K.',  zone:'Westlands', lat:-1.2641, lng:36.8024, phone:'+254700000001', operator:'Safaricom' },
    { id:2, name:'Faith W.',  zone:'CBD',       lat:-1.2921, lng:36.8219, phone:'+254700000002', operator:'Airtel Kenya' },
    { id:3, name:'Brian O.',  zone:'Kibera',    lat:-1.3133, lng:36.7920, phone:'+254700000003', operator:'Safaricom' },
    { id:4, name:'Mary N.',   zone:'Karen',     lat:-1.3197, lng:36.7127, phone:'+254700000004', operator:'Telkom Kenya' },
    { id:5, name:'John M.',   zone:'Eastleigh', lat:-1.2756, lng:36.8453, phone:'+254700000005', operator:'Airtel Kenya' },
    { id:6, name:'Agnes A.',  zone:'Parklands', lat:-1.2590, lng:36.8181, phone:'+254700000006', operator:'Safaricom' },
    { id:7, name:'Peter K.',  zone:'Westlands', lat:-1.2680, lng:36.8100, phone:'+254700000007', operator:'Safaricom' },
    { id:8, name:'Grace L.',  zone:'CBD',       lat:-1.2850, lng:36.8300, phone:'+254700000008', operator:'Airtel Kenya' },
  ],
  Lagos: [
    { id:1, name:'Emeka C.',  zone:'Victoria Island', lat:6.4281, lng:3.4219, phone:'+234800000001', operator:'MTN Nigeria' },
    { id:2, name:'Ngozi A.',  zone:'Ikeja',           lat:6.5958, lng:3.3419, phone:'+234800000002', operator:'Airtel Nigeria' },
    { id:3, name:'Tunde B.',  zone:'Surulere',        lat:6.5022, lng:3.3577, phone:'+234800000003', operator:'MTN Nigeria' },
    { id:4, name:'Chioma O.', zone:'Lekki',           lat:6.4483, lng:3.5137, phone:'+234800000004', operator:'Glo Nigeria' },
    { id:5, name:'Bola F.',   zone:'Mushin',          lat:6.5355, lng:3.3538, phone:'+234800000005', operator:'Airtel Nigeria' },
    { id:6, name:'Kemi S.',   zone:'Yaba',            lat:6.5050, lng:3.3756, phone:'+234800000006', operator:'MTN Nigeria' },
    { id:7, name:'Dele R.',   zone:'Victoria Island', lat:6.4350, lng:3.4300, phone:'+234800000007', operator:'MTN Nigeria' },
    { id:8, name:'Funke M.',  zone:'Lekki',           lat:6.4500, lng:3.5200, phone:'+234800000008', operator:'Glo Nigeria' },
  ],
  Kampala: [
    { id:1, name:'Moses K.',  zone:'Kololo',   lat:0.3136, lng:32.5811, phone:'+256700000001', operator:'MTN Uganda' },
    { id:2, name:'Annet N.',  zone:'Nakasero', lat:0.3167, lng:32.5667, phone:'+256700000002', operator:'Airtel Uganda' },
    { id:3, name:'Robert M.', zone:'Kawempe',  lat:0.3650, lng:32.5550, phone:'+256700000003', operator:'MTN Uganda' },
    { id:4, name:'Sandra A.', zone:'Makindye', lat:0.2833, lng:32.5833, phone:'+256700000004', operator:'Airtel Uganda' },
    { id:5, name:'David O.',  zone:'Ntinda',   lat:0.3333, lng:32.6167, phone:'+256700000005', operator:'MTN Uganda' },
    { id:6, name:'Prossy W.', zone:'Kireka',   lat:0.3167, lng:32.6500, phone:'+256700000006', operator:'Airtel Uganda' },
    { id:7, name:'Ivan B.',   zone:'Kololo',   lat:0.3200, lng:32.5900, phone:'+256700000007', operator:'MTN Uganda' },
    { id:8, name:'Lydia K.',  zone:'Nakasero', lat:0.3100, lng:32.5700, phone:'+256700000008', operator:'Airtel Uganda' },
  ],
  Accra: [
    { id:1, name:'Kwame A.',  zone:'Airport Residential', lat:5.6037, lng:-0.1870, phone:'+233200000001', operator:'MTN Ghana' },
    { id:2, name:'Abena M.',  zone:'Osu',                 lat:5.5560, lng:-0.1870, phone:'+233200000002', operator:'Vodafone Ghana' },
    { id:3, name:'Kofi B.',   zone:'Nima',                lat:5.5800, lng:-0.2050, phone:'+233200000003', operator:'MTN Ghana' },
    { id:4, name:'Akosua F.', zone:'East Legon',          lat:5.6350, lng:-0.1550, phone:'+233200000004', operator:'AirtelTigo' },
    { id:5, name:'Yaw D.',    zone:'Madina',              lat:5.6800, lng:-0.1700, phone:'+233200000005', operator:'MTN Ghana' },
    { id:6, name:'Efua S.',   zone:'Tema',                lat:5.6698, lng:-0.0166, phone:'+233200000006', operator:'Vodafone Ghana' },
    { id:7, name:'Nana K.',   zone:'Osu',                 lat:5.5600, lng:-0.1800, phone:'+233200000007', operator:'MTN Ghana' },
    { id:8, name:'Adwoa P.',  zone:'East Legon',          lat:5.6400, lng:-0.1600, phone:'+233200000008', operator:'AirtelTigo' },
  ],
  'Dar es Salaam': [
    { id:1, name:'Juma A.',    zone:'Masaki',    lat:-6.7924, lng:39.2083, phone:'+255700000001', operator:'Vodacom Tanzania' },
    { id:2, name:'Fatuma H.',  zone:'Kariakoo',  lat:-6.8235, lng:39.2694, phone:'+255700000002', operator:'Airtel Tanzania' },
    { id:3, name:'Hassan M.',  zone:'Kinondoni', lat:-6.7800, lng:39.2700, phone:'+255700000003', operator:'Vodacom Tanzania' },
    { id:4, name:'Zainab K.',  zone:'Temeke',    lat:-6.8700, lng:39.2800, phone:'+255700000004', operator:'Tigo Tanzania' },
    { id:5, name:'Omar S.',    zone:'Ilala',     lat:-6.8300, lng:39.2500, phone:'+255700000005', operator:'Airtel Tanzania' },
    { id:6, name:'Amina B.',   zone:'Mikocheni', lat:-6.7600, lng:39.2400, phone:'+255700000006', operator:'Vodacom Tanzania' },
    { id:7, name:'Rashid N.',  zone:'Masaki',    lat:-6.7950, lng:39.2100, phone:'+255700000007', operator:'Vodacom Tanzania' },
    { id:8, name:'Mwajuma A.', zone:'Kinondoni', lat:-6.7750, lng:39.2750, phone:'+255700000008', operator:'Tigo Tanzania' },
  ],
};

// Currency per city
const cityCurrency = {
  Kigali: 'RWF', Nairobi: 'KES', Lagos: 'NGN',
  Kampala: 'UGX', Accra: 'GHS', 'Dar es Salaam': 'TZS'
};

// CHECK 1: Location Verification
function checkLocation(driver, city) {
  const zones = cityZones[city] || cityZones['Kigali'];
  const coverage = zones[driver.zone] || { signal: 'MEDIUM', reliability: 0.7 };
  const verified = coverage.reliability > 0.6;
  return {
    api: 'Location Verification',
    passed: verified,
    details: verified
      ? `Driver verified at ${driver.zone} ±${Math.floor(Math.random()*5)+1}m accuracy`
      : `Location mismatch detected in ${driver.zone} - low coverage zone`,
    reliability: coverage.reliability
  };
}

// CHECK 2: Device Status
function checkDeviceStatus(driver, city) {
  const zones = cityZones[city] || cityZones['Kigali'];
  const coverage = zones[driver.zone] || { signal: 'MEDIUM', reliability: 0.7 };
  const connected = coverage.signal !== 'LOW';
  return {
    api: 'Device Status',
    passed: connected,
    details: connected
      ? `Device connected - ${coverage.signal} signal via ${driver.operator}`
      : `Device unreachable - ${coverage.signal} signal in ${driver.zone}`,
    signal: coverage.signal,
    operator: driver.operator
  };
}

// CHECK 3: QoS on Demand
function checkQoS(driver, locationPassed, devicePassed) {
  if (!locationPassed || !devicePassed) {
    return { api: 'QoS on Demand', passed: false, details: 'QoS skipped - driver failed previous checks' };
  }
  const boosted = Math.random() > 0.2;
  return {
    api: 'QoS on Demand',
    passed: boosted,
    details: boosted ? `Network boosted to 10Mbps minimum for trip duration` : `QoS boost failed - insufficient resources`
  };
}

// CHECK 4: SIM Swap
function checkSIMSwap(driver) {
  const safe = Math.random() > 0.15;
  return {
    api: 'SIM Swap Detection',
    passed: safe,
    details: safe ? `SIM card stable - no recent swap detected` : `WARNING: SIM swap detected in last 24hrs`
  };
}

function calculateScore(checks) {
  return checks.filter(c => c.passed).length * 25;
}

function getAIDecision(driver, checks, score) {
  if (score >= 75) return `✅ ASSIGN: ${driver.name} is dispatch-ready in ${driver.zone}. Score: ${score}/100`;
  if (score >= 50) return `⚠️ CAUTION: ${driver.name} failed: ${checks.filter(c=>!c.passed).map(c=>c.api).join(', ')}`;
  return `❌ SKIP: ${driver.name} failed critical checks. Routing to next driver.`;
}

// MAIN DISPATCH ENDPOINT
router.post('/check', async (req, res) => {
  const { pickup, dropoff, city = 'Kigali' } = req.body;
  const drivers = cityDrivers[city] || cityDrivers['Kigali'];
  const results = [];

  for (const driver of drivers) {
    const locCheck = checkLocation(driver, city);
    const devCheck = checkDeviceStatus(driver, city);
    const qosCheck = checkQoS(driver, locCheck.passed, devCheck.passed);
    const simCheck = checkSIMSwap(driver);
    const checks = [locCheck, devCheck, qosCheck, simCheck];
    const score = calculateScore(checks);
    results.push({ driver, checks, score, aiDecision: getAIDecision(driver, checks, score), eligible: score >= 75 });
  }

  results.sort((a, b) => b.score - a.score);
  const assigned = results.find(r => r.eligible);
  const aiAnalysis = await analyzeDispatch({ pickup, dropoff, results, assigned });

  res.json({
    success: true,
    request: { pickup, dropoff, city },
    city,
    currency: cityCurrency[city] || 'USD',
    totalDriversChecked: drivers.length,
    eligibleDrivers: results.filter(r => r.eligible).length,
    assigned: assigned || null,
    allResults: results,
    aiAnalysis
  });
});

// GET drivers by city
router.get('/drivers', (req, res) => {
  const city = req.query.city || 'Kigali';
  const drivers = cityDrivers[city] || cityDrivers['Kigali'];
  res.json({ drivers, total: drivers.length, city });
});

// GET all cities
router.get('/cities', (req, res) => {
  res.json({ cities: Object.keys(cityDrivers), total: Object.keys(cityDrivers).length });
});

module.exports = router;