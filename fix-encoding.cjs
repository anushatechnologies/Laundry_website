const fs = require('fs');
const path = require('path');

// Map of corrupted byte sequences to correct Unicode characters
const fixes = [
  ['â\u0080\u0094', '\u2014'],        // em-dash
  ['â\u0080\u0099', '\u2019'],        // right single quote
  ['â\u0080\u009C', '\u201C'],        // left double quote
  ['â\u0080\u009D', '\u201D'],        // right double quote
  ['â\u0080\u00A2', '\u2022'],        // bullet
  ['â\u02DC\u2026', '\u2605'],        // star filled
  ['â\u02DC\u2020', '\u2606'],        // star empty
  ['â\u0080\u0098', '\u2018'],        // left single quote
  ['â\u0082\u00B9', '\u20B9'],        // rupee sign
  ['â\u0080\u00A6', '\u2026'],        // ellipsis
  ['â\u0080\u0093', '\u2013'],        // en-dash
  ['\u00C3\u00A9', '\u00E9'],         // e-acute
  ['\u00C3\u00A8', '\u00E8'],         // e-grave
  ['\u00C2\u00A0', ' '],              // non-breaking space -> regular space
  ['â\u0084\u00A2', '\u2122'],        // trademark
  ['\u00C2\u00A9', '\u00A9'],         // copyright
  ['\u00C2\u00AE', '\u00AE'],         // registered
];

const stringFixes = [
  ['â€"', '\u2014'],        
  ['â€™', '\u2019'],        
  ['â€œ', '\u201C'],        
  ['â€', '\u201D'],         
  ['â€¢', '\u2022'],        
  ['â˜…', '\u2605'],        
  ['â˜†', '\u2606'],        
  ['â€˜', '\u2018'],        
  ['â€¦', '\u2026'],        
  ['â€"', '\u2013'],        
];

const filesToFix = [
  'src/components/home/Hero.tsx',
  'src/components/home/HowItWorks.tsx',
  'src/components/home/WhyChooseUs.tsx',
  'src/components/home/CtaBanner.tsx',
  'src/components/home/Testimonials.tsx',
  'src/components/home/TestimonialsAndApp.tsx',
  'src/components/home/CategoryGrid.tsx',
  'src/components/home/SubscriptionCards.tsx',
  'src/components/home/PricingOverview.tsx',
  'src/components/home/OrderTrackerBanner.tsx',
  'src/components/home/OffersBanner.tsx',
  'src/components/home/MostLovedServices.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/layout/Navbar.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/loyalty/page.tsx',
  'src/app/wallet/page.tsx',
  'src/app/track/page.tsx',
  'src/app/orders/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/services/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/subscriptions/page.tsx',
  'src/app/book/page.tsx',
  'src/app/addresses/page.tsx',
];

let totalFixed = 0;
filesToFix.forEach(f => {
  const fullPath = path.join(process.cwd(), f);
  if (!fs.existsSync(fullPath)) { console.log('SKIP:', f); return; }
  
  // Read as Latin1 to preserve raw bytes
  let rawBuf = fs.readFileSync(fullPath);
  let content = rawBuf.toString('utf8');
  
  let changed = false;
  stringFixes.forEach(([from, to]) => {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    totalFixed++;
    console.log('FIXED:', f);
  } else {
    console.log('OK:', f);
  }
});
console.log('\nTotal files fixed:', totalFixed);
