const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
// Cache WHO responses for 24 hours to avoid rate limiting
const icdCache = new NodeCache({ stdTTL: 86400 });

// Fallback subset in case of WHO API rate limits or lack of Auth Token
const fallbackICDList = [
  { code: 'J45.901', desc: 'Unspecified asthma with (acute) exacerbation' },
  { code: 'J18.9', desc: 'Pneumonia, unspecified organism' },
  { code: 'I10', desc: 'Essential (primary) hypertension' },
  { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
  { code: 'R06.02', desc: 'Shortness of breath' },
  { code: 'A09', desc: 'Infectious gastroenteritis and colitis, unspecified' },
  { code: 'B34.9', desc: 'Viral infection, unspecified' },
  { code: 'N39.0', desc: 'Urinary tract infection, site not specified' },
  { code: 'M54.5', desc: 'Low back pain' },
  { code: 'K21.9', desc: 'Gastro-esophageal reflux disease without esophagitis' }
];

// GET /api/icd10/search?q=asthma
router.get('/search', async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.json([]);
  }

  // 1. Check Cache
  const cacheKey = `icd-search-${query.toLowerCase()}`;
  const cachedData = icdCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  // 2. We use a public clinical tables API as an accessible proxy for ICD-10 searching
  // since the official WHO API requires a registered OAuth Client ID and Secret.
  try {
    const response = await axios.get(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(query)}&maxList=20`);
    
    // Format response: [[code, desc], [code, desc]] -> [{code, desc}]
    const results = response.data[3].map(item => ({
      code: item[0],
      desc: item[1]
    }));

    // Cache the result
    icdCache.set(cacheKey, results);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching ICD-10 codes from NIH/WHO proxy:', error.message);
    
    // Fallback to local subset
    const filteredFallback = fallbackICDList.filter(d => 
      d.code.toLowerCase().includes(query.toLowerCase()) || 
      d.desc.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filteredFallback);
  }
});

module.exports = router;
