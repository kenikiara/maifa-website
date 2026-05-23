-- ═══════════════════════════════════════════════════════
-- MAIFA — Articles / Blog migration
-- Run once in phpMyAdmin SQL tab
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS articles (
    id           INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(300)  NOT NULL,
    slug         VARCHAR(300)  NOT NULL,
    excerpt      VARCHAR(600)  NOT NULL DEFAULT '',
    content      LONGTEXT      NOT NULL,
    category     VARCHAR(100)  NOT NULL DEFAULT 'General',
    tags         VARCHAR(500)  NOT NULL DEFAULT '',
    meta_title   VARCHAR(200)  NOT NULL DEFAULT '',
    meta_desc    VARCHAR(300)  NOT NULL DEFAULT '',
    cover_image  VARCHAR(500)  NOT NULL DEFAULT '',
    author       VARCHAR(100)  NOT NULL DEFAULT 'Maifa Team',
    published    TINYINT(1)    NOT NULL DEFAULT 1,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 5 SEO-Driven Seed Articles ────────────────────────

INSERT IGNORE INTO articles (title, slug, excerpt, content, category, tags, meta_title, meta_desc, author) VALUES

('Best Car Battery in Kenya 2025 — Amaron, Exide & Chloride Compared',
'best-car-battery-kenya-2025',
'Choosing the right car battery in Kenya matters more than you think. We compare Kenya''s three biggest brands — Amaron, Exide and Chloride — on price, lifespan, warranty and performance in tropical heat.',
'<h2>Which Car Battery Brand Should You Choose in Kenya?</h2>
<p>Walk into any battery shop in Nairobi and you will be faced with three dominant brands: <strong>Amaron</strong>, <strong>Exide</strong>, and <strong>Chloride</strong>. Each has loyal fans — but which one is genuinely best for Kenyan roads, Kenyan heat, and Kenyan driving conditions?</p>
<p>We have sold and serviced thousands of batteries across Nairobi, Kiambu, and Mombasa. Here is the honest comparison.</p>

<h2>Amaron — The Long-Life Benchmark</h2>
<p>Amaron is manufactured by Amara Raja Batteries in India and has become Kenya''s top-selling battery brand for good reason. It is engineered specifically for high-heat environments using <strong>High Heat Technology (HHT)</strong> — a proprietary alloy that resists grid corrosion caused by tropical temperatures.</p>
<ul>
  <li><strong>Lifespan:</strong> 3–5 years under normal use</li>
  <li><strong>Warranty:</strong> Up to 18 months replacement guarantee</li>
  <li><strong>Price range:</strong> KES 9,800 – KES 29,500 depending on model</li>
  <li><strong>Best for:</strong> Toyota, Nissan, Honda, Subaru, Isuzu</li>
</ul>
<p>The <strong>Amaron NS70L</strong> (65Ah, 600 CCA) is Kenya''s single best-selling battery model — it fits the majority of Japanese vehicles on Kenyan roads and consistently outlasts its competitors in independent tests.</p>

<h2>Exide — The Established Performer</h2>
<p>Exide has been in the Kenyan market for decades and offers solid reliability at a mid-range price. Their batteries are manufactured to European standards and perform well in most standard sedans and SUVs.</p>
<ul>
  <li><strong>Lifespan:</strong> 2–4 years</li>
  <li><strong>Warranty:</strong> 12 months</li>
  <li><strong>Price range:</strong> KES 8,500 – KES 26,000</li>
  <li><strong>Best for:</strong> Daily drivers, taxis, matatus</li>
</ul>
<p>Exide is a dependable choice but struggles slightly in extreme heat compared to Amaron''s HHT technology. If your car sits in the sun for hours each day, Amaron has the edge.</p>

<h2>Chloride Exide — The Commercial Workhorse</h2>
<p>Chloride Exide (locally produced in Kenya) is the go-to option for commercial vehicles — trucks, matatus, buses, and heavy equipment. Its <strong>Powerlast</strong> range is designed for deep discharge and frequent recharging cycles typical in commercial use.</p>
<ul>
  <li><strong>Lifespan:</strong> 2–3 years in heavy-duty use</li>
  <li><strong>Warranty:</strong> 12 months</li>
  <li><strong>Price range:</strong> KES 7,500 – KES 22,000</li>
  <li><strong>Best for:</strong> Trucks, matatus, tractors, generators</li>
</ul>

<h2>Side-by-Side Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <thead><tr style="background:#f0ede6"><th style="padding:10px;text-align:left;border:1px solid #ddd">Feature</th><th style="padding:10px;text-align:left;border:1px solid #ddd">Amaron</th><th style="padding:10px;text-align:left;border:1px solid #ddd">Exide</th><th style="padding:10px;text-align:left;border:1px solid #ddd">Chloride</th></tr></thead>
  <tbody>
    <tr><td style="padding:10px;border:1px solid #ddd">Heat resistance</td><td style="padding:10px;border:1px solid #ddd">⭐⭐⭐⭐⭐</td><td style="padding:10px;border:1px solid #ddd">⭐⭐⭐</td><td style="padding:10px;border:1px solid #ddd">⭐⭐⭐</td></tr>
    <tr style="background:#fafaf8"><td style="padding:10px;border:1px solid #ddd">Lifespan</td><td style="padding:10px;border:1px solid #ddd">3–5 years</td><td style="padding:10px;border:1px solid #ddd">2–4 years</td><td style="padding:10px;border:1px solid #ddd">2–3 years</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd">Warranty</td><td style="padding:10px;border:1px solid #ddd">18 months</td><td style="padding:10px;border:1px solid #ddd">12 months</td><td style="padding:10px;border:1px solid #ddd">12 months</td></tr>
    <tr style="background:#fafaf8"><td style="padding:10px;border:1px solid #ddd">Maintenance</td><td style="padding:10px;border:1px solid #ddd">Maintenance-free</td><td style="padding:10px;border:1px solid #ddd">Maintenance-free</td><td style="padding:10px;border:1px solid #ddd">Some models need topping</td></tr>
    <tr><td style="padding:10px;border:1px solid #ddd">Best use</td><td style="padding:10px;border:1px solid #ddd">Personal cars</td><td style="padding:10px;border:1px solid #ddd">Personal cars</td><td style="padding:10px;border:1px solid #ddd">Commercial vehicles</td></tr>
  </tbody>
</table>

<h2>Our Verdict</h2>
<p>For personal vehicles — Toyota, Nissan, Honda, Subaru — <strong>Amaron is the clear winner</strong> in Kenya. The heat technology and longer warranty make it worth the slight price premium. For commercial fleets on tight budgets, Chloride Exide remains the most practical choice.</p>
<p>At Maifa, we stock the full Amaron range across our Nairobi branches. We offer <strong>free installation and same-day delivery</strong> across Nairobi, Kiambu, and Mombasa.</p>',
'Brand Comparison', 'amaron kenya, exide kenya, car battery kenya, best car battery nairobi',
'Best Car Battery in Kenya 2025 | Amaron vs Exide vs Chloride',
'Compare Kenya''s top car battery brands — Amaron, Exide and Chloride. Find the longest-lasting battery for your car with free installation in Nairobi.',
'Maifa Team'),

('Car Battery Price in Kenya 2025 — Complete Nairobi Price Guide',
'car-battery-price-kenya-nairobi-2025',
'How much does a car battery cost in Kenya in 2025? We break down current prices by type — from small sedan batteries at KES 9,800 to heavy-duty and European models at KES 29,500.',
'<h2>How Much Does a Car Battery Cost in Kenya?</h2>
<p>Car battery prices in Kenya range from <strong>KES 9,800 to KES 29,500</strong> depending on the brand, size, and battery type. Prices have stabilised in 2025 after the exchange rate volatility of 2023–2024.</p>
<p>Below is a complete, up-to-date price guide for the most popular batteries sold in Nairobi.</p>

<h2>Standard Car Battery Prices (Sedans & Small Cars)</h2>
<p>These batteries fit the most common vehicles on Kenyan roads — Toyota Axio, Vitz, Fielder, Honda Fit, Nissan Note, and similar small-engine cars.</p>
<ul>
  <li><strong>Amaron NS40 35Ah</strong> — KES 10,500 <em>(small hatchbacks, Vitz, March)</em></li>
  <li><strong>Amaron 55B24L 45Ah</strong> — KES 12,800 <em>(Axio, Fit, Demio)</em></li>
  <li><strong>Amaron NS70L 65Ah</strong> — KES 17,000 <em>(Premio, Fielder, Harrier)</em></li>
  <li><strong>Amaron Flo 50B20L</strong> — KES 9,800 <em>(budget option for small hatchbacks)</em></li>
</ul>

<h2>Large Car & SUV Battery Prices</h2>
<p>SUVs and large-engine vehicles need higher Ah and CCA ratings. If you drive a Land Cruiser, Prado, X-Trail, or Navara, expect to spend more.</p>
<ul>
  <li><strong>Amaron Flo 95D26L 70Ah</strong> — KES 19,000</li>
  <li><strong>Amaron N95 125D31R 95Ah</strong> — KES 22,800</li>
</ul>

<h2>EFB Battery Prices (Stop-Start Vehicles)</h2>
<p>If your car has an idle stop-start system (the engine cuts when you stop at traffic lights), you <strong>must</strong> use an EFB or AGM battery — a standard battery will fail within months.</p>
<ul>
  <li><strong>Amaron Onyx EFB 500 CCA</strong> — KES 16,500</li>
  <li><strong>Amaron Hegmo EFB 650 CCA</strong> — KES 18,000</li>
  <li><strong>Amaron Onyx EFB 660 CCA</strong> — KES 19,500</li>
</ul>

<h2>European Car Battery Prices</h2>
<p>BMW, Mercedes, Audi, and Volkswagen require DIN-standard batteries with high CCA ratings. Using the wrong battery can trigger dashboard warnings on these vehicles.</p>
<ul>
  <li><strong>Amaron Pro H5 DIN66L 610 CCA</strong> — KES 24,500</li>
  <li><strong>Amaron 730 CCA T-DIN80L</strong> — KES 26,500</li>
  <li><strong>Amaron Pro 800 CCA DIN</strong> — KES 27,000</li>
  <li><strong>Amaron Pro H8 DIN100L 900 CCA</strong> — KES 29,500</li>
</ul>

<h2>Heavy Duty Battery Prices</h2>
<ul>
  <li><strong>Chloride Exide Powerlast 88Ah</strong> — KES 21,000</li>
  <li><strong>Amaron N80 Hi-Way 80Ah</strong> — KES 24,000</li>
  <li><strong>Amaron T110 145D31L 110Ah</strong> — KES 28,500</li>
</ul>

<h2>What Affects Battery Price in Kenya?</h2>
<ul>
  <li><strong>Brand</strong> — Amaron commands a premium for longer life and better warranty</li>
  <li><strong>Ah rating</strong> — higher Ah = more energy capacity = higher price</li>
  <li><strong>CCA rating</strong> — higher cold cranking amps = more powerful = higher price</li>
  <li><strong>Type</strong> — EFB and AGM cost 20–30% more than standard batteries</li>
  <li><strong>Old battery trade-in</strong> — bring your old battery and save up to <strong>KES 1,500</strong></li>
</ul>

<h2>Get the Best Price in Nairobi</h2>
<p>At Maifa we offer competitive prices with <strong>free installation</strong> at all Nairobi branches. We also accept <strong>M-Pesa, card, and cash</strong>. Bring your old battery for up to KES 1,500 off your new one.</p>',
'Buying Guide', 'car battery price kenya, battery price nairobi 2025, amaron price kenya',
'Car Battery Price in Kenya 2025 | Nairobi Price Guide',
'Up-to-date car battery prices in Kenya 2025. Standard batteries from KES 9,800. EFB, heavy-duty and European models compared. Free installation in Nairobi.',
'Maifa Team'),

('7 Warning Signs Your Car Battery is Dying in Kenya',
'signs-car-battery-dying-kenya',
'Your car battery gives warning signs before it fails completely — and in Nairobi traffic, a dead battery is the last thing you need. Here are 7 signs to watch out for, plus what to do.',
'<h2>How to Know Your Car Battery is Failing</h2>
<p>A car battery does not usually die without warning. There are clear signs that it is weakening — and if you catch them early, you can replace it before you are stranded on Mombasa Road or stuck in the Westlands underpass.</p>

<h2>1. Slow or Struggling Engine Crank</h2>
<p>If your engine turns over slowly when you start — that grinding, laboured "rrr-rrr-rrr" sound instead of the usual quick fire — your battery is struggling to deliver enough current to the starter motor. This is often the <strong>earliest and most reliable</strong> sign of a weakening battery.</p>
<p><strong>What to do:</strong> Get a free battery test at any Maifa branch. Takes two minutes.</p>

<h2>2. The Battery Warning Light Comes On</h2>
<p>The battery icon on your dashboard (looks like a small rectangle with + and – terminals) means the charging system has detected a problem. It could be the battery itself, the alternator, or a loose cable. Do not ignore it.</p>

<h2>3. Dim Headlights and Weak Electrics</h2>
<p>If your headlights look noticeably dimmer than usual — especially at idle — your battery is not holding a proper charge. You may also notice the radio cutting out, windows moving slower than normal, or dashboard lights flickering.</p>

<h2>4. Swollen or Bloated Battery Case</h2>
<p>Kenya''s heat can cause a battery''s internal plates to warp and the casing to swell. If your battery looks puffy, rectangular sides bulging outward — <strong>replace it immediately</strong>. A swollen battery is at risk of leaking acid or, in extreme cases, rupturing.</p>

<h2>5. Rotten Egg Smell (Sulphur)</h2>
<p>A strong sulphur smell around the engine bay means the battery is overcharging and releasing hydrogen sulphide gas. This is dangerous. Check for a faulty voltage regulator or a battery past its end-of-life.</p>

<h2>6. Battery Older Than 3 Years</h2>
<p>In Kenya''s tropical climate, car batteries age faster than in cooler climates. A battery that performs perfectly in Germany for 5 years may last only 3–4 years in Nairobi''s heat. If your battery is over 3 years old, schedule a test — even if it seems fine.</p>
<p>Check the <strong>manufacture date sticker</strong> on the battery top: it shows the month and year (e.g. "05/22" = May 2022).</p>

<h2>7. Frequent Jump-Starts</h2>
<p>Needing a jump-start more than once is not bad luck — it is a dead battery. A healthy battery should start your car reliably every single time. If you are calling someone for jump cables regularly, stop and replace the battery.</p>

<h2>What To Do If Your Battery Fails in Nairobi</h2>
<ol>
  <li>Call Maifa on <strong>WhatsApp: 0791 899 602</strong></li>
  <li>We will tell you the right battery for your car instantly</li>
  <li>Choose same-day delivery and fitting at your location, or drive to the nearest Maifa branch</li>
  <li>We take your old battery as a trade-in (up to KES 1,500 off)</li>
</ol>
<p>Do not risk getting stranded. A battery test at Maifa is free and takes less time than filling up with fuel.</p>',
'Car Tips', 'car battery dying signs, battery warning light kenya, car wont start nairobi',
'7 Signs Your Car Battery is Dying | Kenya Driver Guide',
'Learn the 7 warning signs of a failing car battery in Kenya. From slow cranking to swollen casing — and what to do before you get stranded in Nairobi.',
'Maifa Team'),

('Best Battery for Toyota Axio, Vitz, Fielder and Premio in Kenya',
'best-battery-toyota-axio-vitz-fielder-premio-kenya',
'Toyota is the most popular car brand in Kenya — and getting the right battery size matters. We break down the exact battery for every popular Toyota model, from the Vitz to the Land Cruiser.',
'<h2>Toyota Battery Guide for Kenya</h2>
<p>Toyota vehicles make up over 40% of all cars on Kenyan roads. If you drive an Axio, Fielder, Vitz, Premio, Harrier, Land Cruiser or Hilux — this guide gives you the exact battery specification you need.</p>
<p>Using the wrong size battery can cause electrical faults, shortened battery life, and in some cases, damage to the vehicle''s electrical system.</p>

<h2>Toyota Vitz & Nissan March — NS40 (35Ah)</h2>
<p>Small 1,000cc and 1,300cc engines have modest power demands. The correct battery is the <strong>NS40 / 42B20L</strong> format.</p>
<ul>
  <li>Spec: 12V, 35Ah, 335 CCA</li>
  <li>Recommended: <strong>Amaron Hi Life NS40</strong> — KES 10,500</li>
  <li>Fits: Toyota Vitz (KSP90, KSP130), Nissan March, Suzuki Swift</li>
</ul>

<h2>Toyota Axio, Honda Fit, Mazda Demio — 55B24L (45Ah)</h2>
<p>Mid-range 1,500cc engines in Kenyan favourites like the Axio and Fit require a slightly larger battery.</p>
<ul>
  <li>Spec: 12V, 45Ah, 380 CCA</li>
  <li>Recommended: <strong>Amaron Hi Life 55B24L</strong> — KES 12,800</li>
  <li>Fits: Toyota Axio (NZE141/161), Honda Fit (GD1/GD3), Mazda Demio</li>
</ul>

<h2>Toyota Premio, Fielder, Allion — NS70L (65Ah)</h2>
<p>This is <strong>Kenya''s most popular battery size</strong>. The NS70L fits the majority of medium-sized Japanese vehicles sold in Kenya.</p>
<ul>
  <li>Spec: 12V, 65Ah, 600 CCA</li>
  <li>Recommended: <strong>Amaron Hi Life NS70L</strong> — KES 17,000</li>
  <li>Fits: Toyota Premio (NZT260), Fielder (NZE141/164), Allion, Wish, Noah</li>
</ul>
<p>This is our best-selling battery at Maifa and has a proven track record on Kenyan roads.</p>

<h2>Toyota Harrier, RAV4, Prado — 95D26L or N95 (70–95Ah)</h2>
<p>Larger SUVs and crossovers with 2,000cc+ engines need batteries with higher reserve capacity.</p>
<ul>
  <li>Spec: 12V, 70–95Ah, 600 CCA</li>
  <li>Recommended: <strong>Amaron Flo 95D26L</strong> (KES 19,000) or <strong>Amaron N95</strong> (KES 22,800)</li>
  <li>Fits: Toyota Harrier (MCU35), RAV4 (ACA21), Prado 120 & 150</li>
</ul>

<h2>Toyota Land Cruiser, Hilux D4D — T110 or N80 (80–110Ah)</h2>
<p>Heavy-duty Land Cruisers and diesel pickups need large-capacity batteries that can handle high compression diesel starts and power-hungry accessories.</p>
<ul>
  <li>Spec: 12V, 80–110Ah, 550 CCA</li>
  <li>Recommended: <strong>Amaron N80 Hi-Way</strong> (KES 24,000) or <strong>Amaron T110</strong> (KES 28,500)</li>
  <li>Fits: Toyota Land Cruiser 70/76/79/200, Hilux D4D, Fortuner 2.5D</li>
</ul>

<h2>Stop-Start Toyota Models (EFB Battery Required)</h2>
<p>Newer Toyota Aqua, CH-R, Yaris Cross and some 2020+ Axio models have idle stop-start technology. These <strong>require an EFB battery</strong> — a standard battery will drain and fail within 3–6 months.</p>
<ul>
  <li>Recommended: <strong>Amaron Onyx EFB 500–660 CCA</strong> — KES 16,500–19,500</li>
</ul>

<h2>Not Sure Which Battery Fits Your Toyota?</h2>
<p>Tell us your <strong>Toyota model, year, and engine size</strong> on WhatsApp and we will confirm the exact battery in under 2 minutes. We carry all sizes in stock across our Nairobi branches — with <strong>free fitting and same-day delivery</strong>.</p>',
'Buying Guide', 'toyota battery kenya, axio battery, premio battery, fielder battery kenya, vitz battery nairobi',
'Best Battery for Toyota Axio, Vitz, Fielder & Premio Kenya 2025',
'Find the right battery for your Toyota in Kenya. NS40, NS70L, 55B24L — correct specs for Axio, Vitz, Fielder, Premio, Harrier and Land Cruiser.',
'Maifa Team'),

('Same-Day Car Battery Delivery in Nairobi — How It Works',
'car-battery-delivery-nairobi-same-day',
'Need a car battery delivered and fitted in Nairobi today? Here is exactly how Maifa''s same-day battery delivery service works, which areas we cover, and how to order in under 2 minutes.',
'<h2>Same-Day Car Battery Delivery Across Nairobi</h2>
<p>A dead battery does not wait for a convenient time. That is why Maifa offers <strong>same-day car battery delivery and fitting</strong> across Nairobi, Kiambu County, and Mombasa — with most orders fitted within 2–4 hours of booking.</p>

<h2>How to Order in Under 2 Minutes</h2>
<ol>
  <li><strong>Message us on WhatsApp:</strong> Send your car make, model, and year to <strong>0791 899 602</strong></li>
  <li><strong>We confirm the right battery:</strong> Our team will confirm the correct battery size for your car — usually within 5 minutes</li>
  <li><strong>We confirm your location:</strong> Share your pin or describe your location (home, office, parking lot)</li>
  <li><strong>We deliver and fit:</strong> Our technician arrives with the battery, removes the old one, installs and tests the new one</li>
  <li><strong>Pay on delivery:</strong> M-Pesa, card, or cash — all accepted</li>
</ol>

<h2>Areas We Cover in Nairobi</h2>
<p>We deliver and fit batteries across Nairobi and surrounding areas including:</p>
<ul>
  <li>Westlands, Parklands, Gigiri, Muthaiga</li>
  <li>Upperhill, CBD, Ngong Road, Karen</li>
  <li>Thika Road, Kasarani, Ruiru, Kiambu</li>
  <li>South B, South C, Langata, Rongai</li>
  <li>Mombasa Road, Syokimau, Mlolongo</li>
  <li>Eastlands: Umoja, Kayole, Donholm</li>
</ul>
<p>Not sure if we cover your area? <strong>Just ask on WhatsApp</strong> — we will tell you honestly and recommend the nearest branch if delivery is not possible.</p>

<h2>How Long Does Delivery Take?</h2>
<p>Delivery time depends on your location and time of day:</p>
<ul>
  <li><strong>Branches walk-in:</strong> Immediate — fitted while you wait (15 minutes)</li>
  <li><strong>Within 5km of a branch:</strong> 30–60 minutes</li>
  <li><strong>Across Nairobi:</strong> 2–4 hours same day</li>
  <li><strong>Orders before 2pm:</strong> Guaranteed same-day</li>
  <li><strong>Orders after 2pm:</strong> Same day where possible, next morning guaranteed</li>
</ul>

<h2>What the Fitting Includes</h2>
<p>When our technician arrives, the service includes:</p>
<ul>
  <li>Removal of your old battery</li>
  <li>Cleaning of battery terminals</li>
  <li>Installation of new battery</li>
  <li>Load test to confirm proper charging</li>
  <li>Disposal or trade-in of your old battery (<strong>up to KES 1,500 credit</strong>)</li>
</ul>
<p>The fitting itself takes about 15 minutes at your location.</p>

<h2>Bring Your Old Battery — Save Up to KES 1,500</h2>
<p>We accept old batteries as trade-ins against the cost of your new one. The trade-in value depends on the condition and size of the old battery, but typically ranges from <strong>KES 500 to KES 1,500</strong>. This makes switching to a new battery significantly more affordable.</p>

<h2>Payment Options</h2>
<ul>
  <li><strong>M-Pesa:</strong> Till number or send money — most popular option</li>
  <li><strong>Card:</strong> Visa and Mastercard accepted</li>
  <li><strong>Cash:</strong> Accepted at all branches and on delivery</li>
</ul>

<h2>Order Your Battery Now</h2>
<p>Message <strong>0791 899 602</strong> on WhatsApp with your car model and location. We will get back to you in minutes and have a battery fitted at your car today.</p>',
'Service', 'car battery delivery nairobi, battery fitting nairobi, same day battery kenya',
'Same-Day Car Battery Delivery in Nairobi | Maifa',
'Same-day car battery delivery and fitting across Nairobi. Order on WhatsApp, delivered in 2–4 hours. M-Pesa accepted. Old battery trade-in up to KES 1,500.',
'Maifa Team');
