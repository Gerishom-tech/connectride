const express = require('express');
const router = express.Router();
const { analyzeDispatch } = require('./ai-engine');

// Kigali zones coverage data
const kigaliCoverage = {
  'Kicukiro': { signal: 'HIGH', reliability: 0.95 },
  'Gasabo': { signal: 'LOW', reliability: 0.45 },
  'Nyarugenge': { signal: 'MEDIUM', reliability: 0.70 },
  'Kimironko': { signal: 'HIGH', reliability: 0.90 },
  'Nyamirambo': { signal: 'MEDIUM', reliability: 0.75 },
};

// Mock drivers in Kigali
const drivers = [
  { id: 1, name: 'Jean-Paul M.', zone: 'Kicukiro', lat: -1.9706, lng: 30.1044, phone: '+250781000001' },
  { id: 2, name: 'Amina K.', zone: 'Kimironko', lat: -1.9355, lng: 30.1116, phone: '+250781000002' },
  { id: 3, name: 'Patrick N.', zone: 'Nyarugenge', lat: -1.9536, lng: 30.0605, phone: '+250781000003' },
  { id: 4, name: 'Grace U.', zone: 'Kicukiro', lat: -1.9800, lng: 30.1200, phone: '+250781000004' },
  { id: 5, name: 'David M.', zone: 'Gasabo', lat: -1.9200, lng: 30.1300, phone: '+250781000005' },
  { id: 6, name: 'Olive R.', zone: 'Nyamirambo', lat: -1.9750, lng: 30.0450, phone: '+250781000006' },
];

// CHECK 1: Location Verification
function checkLocation(driver) {
  const coverage = kigaliCoverage[driver.zone];
  const verified = coverage.reliability > 0.6;
  return {
    api: 'Location Verification',
    passed: verified,
    details: verified
      ? `Driver verified at ${driver.zone} ±${Math.floor(Math.random() * 5) + 1}m accuracy`
      : `Location mismatch detected in ${driver.zone} - low coverage zone`,
    reliability: coverage.reliability
  };
}

// CHECK 2: Device Status
function checkDeviceStatus(driver) {
  const coverage = kigaliCoverage[driver.zone];
  const connected = coverage.signal !== 'LOW';
  return {
    api: 'Device Status',
    passed: connected,
    details: connected
      ? `Device connected - ${coverage.signal} signal strength`
      : `Device unreachable - ${coverage.signal} signal in ${driver.zone}`,
    signal: coverage.signal
  };
}

// CHECK 3: QoS on Demand
function checkQoS(driver, locationPassed, devicePassed) {
  if (!locationPassed || !devicePassed) {
    return {
      api: 'QoS on Demand',
      passed: false,
      details: 'QoS skipped - driver failed previous checks'
    };
  }
  const boosted = Math.random() > 0.2;
  return {
    api: 'QoS on Demand',
    passed: boosted,
    details: boosted
      ? `Network boosted to 10Mbps minimum for trip duration`
      : `QoS boost failed - insufficient network resources`
  };
}

// CHECK 4: SIM Swap
function checkSIMSwap(driver) {
  const safe = Math.random() > 0.15;
  return {
    api: 'SIM Swap Detection',
    passed: safe,
    details: safe
      ? `SIM card stable - no recent swap detected`
      : `WARNING: SIM swap detected in last 24hrs - security risk`
  };
}

// Calculate dispatch score
function calculateScore(checks) {
  let score = 0;
  checks.forEach(check => {
    if (check.passed) score += 25;
  });
  return score;
}

// Simple AI Decision (fallback)
function getAIDecision(driver, checks, score) {
  if (score >= 75) {
    return `✅ ASSIGN: ${driver.name} is dispatch-ready. All network checks passed in ${driver.zone}. Score: ${score}/100`;
  } else if (score >= 50) {
    const failed = checks.filter(c => !c.passed).map(c => c.api).join(', ');
    return `⚠️ CAUTION: ${driver.name} passed most checks but failed: ${failed}. Score: ${score}/100`;
  } else {
    const failed = checks.filter(c => !c.passed).map(c => c.api).join(', ');
    return `❌ SKIP: ${driver.name} failed critical checks: ${failed}. Routing to next available driver.`;
  }
}

// MAIN DISPATCH ENDPOINT
router.post('/check', async (req, res) => {
  const { pickup, dropoff } = req.body;

  const results = [];

  for (const driver of drivers) {
    const locCheck = checkLocation(driver);
    const devCheck = checkDeviceStatus(driver);
    const qosCheck = checkQoS(driver, locCheck.passed, devCheck.passed);
    const simCheck = checkSIMSwap(driver);

    const checks = [locCheck, devCheck, qosCheck, simCheck];
    const score = calculateScore(checks);
    const aiDecision = getAIDecision(driver, checks, score);

    results.push({
      driver,
      checks,
      score,
      aiDecision,
      eligible: score >= 75
    });
  }

  // Sort by score
  results.sort((a, b) => b.score - a.score);

  // Best driver
  const assigned = results.find(r => r.eligible);

  // Get AI analysis
  const aiAnalysis = await analyzeDispatch({
    pickup,
    dropoff,
    results,
    assigned
  });

  res.json({
    success: true,
    request: { pickup, dropoff },
    totalDriversChecked: drivers.length,
    eligibleDrivers: results.filter(r => r.eligible).length,
    assigned: assigned || null,
    allResults: results,
    aiAnalysis
  });
});

// GET all drivers
router.get('/drivers', (req, res) => {
  res.json({ drivers, total: drivers.length });
});

module.exports = router;