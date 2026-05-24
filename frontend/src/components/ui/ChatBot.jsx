import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────
   KNOWLEDGE BASE — keyword patterns + canned responses
───────────────────────────────────────────────────────── */
const KB = [
  {
    id: 'about',
    patterns: ['about', 'who are you', 'what is maifa', 'maifa company', 'tell me about', 'what do you', 'who is maifa'],
    response: "Maifa is Kenya's trusted Amaron battery specialist 🔋\n\nWe supply and fit **Amaron batteries** — Kenya's #1 selling battery brand — at 3 branches across Nairobi and Mombasa. Every purchase includes **free installation** and up to **18 months warranty**.",
    chips: ['Our locations', 'Battery prices', 'Warranty info'],
  },
  {
    id: 'locations',
    patterns: ['location', 'branch', 'where are you', 'address', 'nairobi', 'mombasa', 'thika', 'kiambu', 'find you', 'find us', 'come in', 'visit'],
    response: "We have 3 branches:\n\n📍 **Thika Road, Nairobi**\n    📞 0791 899 602\n\n📍 **Kiambu Road, Nairobi**\n    📞 0700 777 698\n\n📍 **Mombasa**\n    📞 0701 880 955\n\n⏰ Open Mon–Sat · 7:30 AM – 7:00 PM",
    chips: ['Get directions', 'WhatsApp us', 'Opening hours'],
  },
  {
    id: 'hours',
    patterns: ['hours', 'open', 'opening', 'close', 'closing', 'when', 'operating', 'sunday', 'time', 'schedule'],
    response: "⏰ All Maifa branches are open:\n\n**Monday – Saturday**\n7:30 AM – 7:00 PM\n\n**Sunday:** Closed\n(WhatsApp support still available for urgent queries)",
    chips: ['Our locations', 'WhatsApp us'],
  },
  {
    id: 'warranty',
    patterns: ['warranty', 'guarantee', 'waranti', 'claim', 'broken', 'faulty', 'dead battery', 'replacement', 'defect', 'not working', 'failed'],
    response: "🛡️ All Amaron batteries come with **up to 18 months replacement warranty**.\n\n**To register:** Visit maifa.ke/warranty (takes 2 minutes)\n**To claim:** Bring your battery + receipt to any branch\n**Check status:** Enter your MFA-XXXX code on the warranty page",
    chips: ['Register warranty', 'Check warranty status', 'Call a branch'],
  },
  {
    id: 'price',
    patterns: ['price', 'cost', 'how much', 'bei', 'cheap', 'affordable', 'expensive', 'rate', 'charges', 'ksh', 'kes', 'money', 'budget'],
    response: "💰 Current Amaron battery prices at Maifa:\n\n• **Small cars** (Vitz, March, Fit): from KES 9,800\n• **Mid sedan** (Premio, Axio): from KES 12,800\n• **SUV / Crossover**: from KES 17,000\n• **4x4 / Pickup**: from KES 18,500\n• **European cars**: from KES 24,500\n• **Trucks / Heavy duty**: from KES 22,000\n\n✅ **Free installation included** with every battery!",
    chips: ['Find my battery', 'Order on WhatsApp', 'Shop all batteries'],
  },
  {
    id: 'installation',
    patterns: ['install', 'fit', 'fitting', 'installation', 'replace', 'change', 'fix', 'mount', 'technician', 'mechanic'],
    response: "🔧 **Free installation** is included with every battery purchase!\n\nOur trained technicians fit your battery on-site at any branch — takes about 15–20 minutes. **No appointment needed**, just drive in.",
    chips: ['Our locations', 'Battery prices', 'WhatsApp us'],
  },
  {
    id: 'tradein',
    patterns: ['trade', 'old battery', 'swap', 'exchange', 'trade-in', 'recycle', 'dispose', 'used battery', 'scrap'],
    response: "♻️ **Trade-In Programme** — We buy your old battery!\n\nBring your old or dead battery to any Maifa branch and get a **discount on your new Amaron battery**. WhatsApp us first to get a quote.",
    chips: ['WhatsApp for trade-in', 'Our locations'],
  },
  {
    id: 'amaron',
    patterns: ['amaron', 'brand', 'quality', 'best', 'recommended', 'lifespan', 'life span', 'long lasting', 'durable', 'reliable', 'made in'],
    response: "⚡ **Amaron** is Kenya's #1 selling battery, made by Amara Raja Batteries (India).\n\n✅ **High Heat Technology (HHT)** — built for tropical climates\n✅ **Zero maintenance** — sealed, no water topping needed\n✅ **3–5 year** average lifespan\n✅ Up to **18 months** replacement warranty\n✅ Fits **95%** of vehicles on Kenyan roads",
    chips: ['Find my battery', 'Battery prices', 'Shop batteries'],
  },
  {
    id: 'efb',
    patterns: ['efb', 'start stop', 'start-stop', 'hybrid', 'idle stop', 'aqua', 'prius', 'stop start'],
    response: "🔋 **EFB (Enhanced Flooded Battery)** is designed for modern **start-stop vehicles**:\n\n• Toyota Aqua / Prius\n• Mazda with i-Stop\n• Honda with idle stop\n• Any car with start-stop system\n\nEFB handles frequent charge-discharge cycles far better than a standard battery. Prices from **KES 18,500**.",
    chips: ['Find my battery', 'Battery prices', 'Shop EFB'],
  },
  {
    id: 'contact',
    patterns: ['contact', 'call', 'phone', 'number', 'reach', 'speak to', 'talk to', 'help'],
    response: "📞 Reach us anytime:\n\n• **Thika Road:** 0791 899 602\n• **Kiambu Road:** 0700 777 698\n• **Mombasa:** 0701 880 955\n\n💬 **WhatsApp:** 0791 899 602\n(Fastest — usually reply within minutes!)",
    chips: ['WhatsApp us now', 'Our locations'],
  },
  {
    id: 'order',
    patterns: ['order', 'buy', 'purchase', 'get battery', 'want battery', 'need battery', 'quote', 'book'],
    response: "🛒 Three ways to get your battery:\n\n1. **Walk in** — any branch, no appointment\n2. **WhatsApp** — we confirm price & availability\n3. **Shop online** — maifa.ke/shop\n\nAll options include free on-site fitting!",
    chips: ['WhatsApp to order', 'Shop online', 'Find a branch'],
  },
  {
    id: 'delivery',
    patterns: ['delivery', 'deliver', 'bring', 'come to me', 'home delivery', 'office', 'ship', 'courier'],
    response: "🚗 We primarily serve customers at our **3 branches** (walk-in). For bulk orders or large deliveries within Nairobi, WhatsApp us — we can sometimes arrange drop-off.",
    chips: ['WhatsApp for delivery', 'Our locations'],
  },
]

/* ─────────────────────────────────────────────────────────
   BATTERY RECOMMENDATION WIZARD
───────────────────────────────────────────────────────── */
const VEHICLE_TYPES = [
  { id: 'small',    emoji: '🚗', label: 'Small Car',     desc: 'Vitz, March, Fit, Demio, Axio 1.3' },
  { id: 'sedan',    emoji: '🚙', label: 'Mid Sedan',     desc: 'Premio, Allion, Accord, Camry' },
  { id: 'suv',      emoji: '🏙️', label: 'SUV / Crossover', desc: 'Harrier, RAV4, CX-5, Outlander' },
  { id: 'pickup',   emoji: '🛻', label: '4x4 / Pickup',  desc: 'Land Cruiser, Hilux, Navara, Ranger' },
  { id: 'european', emoji: '🇩🇪', label: 'European Car', desc: 'BMW, Mercedes, VW, Audi, Volvo' },
  { id: 'heavy',    emoji: '🚛', label: 'Truck / Bus',   desc: 'Lorries, Matatus, Commercial' },
]

const RECS = {
  small:    { title: 'Small Car Battery', models: 'Amaron NS40ZL (35Ah) or Flo 50B20L (45Ah)', price: 'from KES 9,800', fits: 'Toyota Vitz, Nissan March, Honda Fit 1.3, Mazda Demio 1.3', shopCat: 'Standard' },
  sedan:    { title: 'Mid-Size Sedan Battery', models: 'Amaron 55B24L (45Ah) or NS70L (65Ah)', price: 'from KES 12,800', fits: 'Toyota Premio, Allion, Camry, Honda Accord, Nissan Teana', shopCat: 'Large Car' },
  suv:      { title: 'SUV / Crossover Battery', models: 'Amaron NS70L (65Ah) or 75D23L (60Ah)', price: 'from KES 17,000', fits: 'Toyota Harrier, RAV4, Mazda CX-5, Mitsubishi Outlander', shopCat: 'Large Car' },
  pickup:   { title: '4x4 / Pickup Battery', models: 'Amaron EFB 75D23L or 105D31L (90Ah)', price: 'from KES 18,500', fits: 'Toyota Land Cruiser, Prado, Hilux, Ford Ranger, Nissan Navara', shopCat: 'EFB' },
  european: { title: 'European Car Battery', models: 'Amaron Euro 60Ah / 72Ah / 80Ah', price: 'from KES 24,500', fits: 'BMW, Mercedes-Benz, VW, Audi, Volvo', shopCat: 'European' },
  heavy:    { title: 'Heavy Duty Battery', models: 'Amaron HiLife 120Ah or 150Ah (pair)', price: 'from KES 22,000', fits: 'Trucks, Lorries, Matatus, Buses, Generators', shopCat: 'Heavy Duty' },
}

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function matchKB(text) {
  const lower = text.toLowerCase()
  let best = null, bestScore = 0
  for (const entry of KB) {
    let score = 0
    for (const p of entry.patterns) {
      if (lower.includes(p)) score += p.split(' ').length * 2
      else for (const word of p.split(' ')) if (word.length > 3 && lower.includes(word)) score += 1
    }
    if (score > bestScore) { bestScore = score; best = entry }
  }
  return bestScore >= 2 ? best : null
}

function fmt(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

const WA = 'https://wa.me/254791899602'

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function ChatBot() {
  const navigate = useNavigate()
  const [open, setOpen]         = useState(false)
  const [msgs, setMsgs]         = useState([])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [chips, setChips]       = useState([])
  const [wizard, setWizard]     = useState(false)
  const [unread, setUnread]     = useState(1)
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)

  /* Init welcome message */
  useEffect(() => {
    setMsgs([{
      id: 1, from: 'bot',
      text: "Hi there! 👋 I'm the **Maifa Battery Assistant**.\n\nI can help you find the right battery for your car, check prices, warranty info, or answer any questions about Maifa.\n\nWhat do you need help with?",
    }])
    setChips(['Find my battery', 'Battery prices', 'Our locations', 'Warranty info', 'Contact us'])
  }, [])

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing, wizard])

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 320)
    }
  }, [open])

  const addMsg = (from, text, extra = {}) => {
    setMsgs(prev => [...prev, { id: Date.now() + Math.random(), from, text, ...extra }])
  }

  const botSay = (text, newChips = [], delay = 750) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addMsg('bot', text)
      setChips(newChips)
    }, delay)
  }

  const fallback = () => botSay(
    "I'm not sure about that — but our team can help right away! 😊\n\nWhatsApp us on **0791 899 602** or call any branch.",
    ['WhatsApp us now', 'Our locations', 'Battery prices']
  )

  const processText = (text) => {
    const lower = text.toLowerCase()

    /* Recommend trigger */
    if (/recommend|which battery|what battery|right battery|suitable|my car|for my|find.*battery|battery.*find/i.test(lower)) {
      botSay("Sure! Let me help you find the perfect battery 🔋\n\nWhat type of vehicle do you have?", [], 550)
      setTimeout(() => { setWizard(true); setChips([]) }, 850)
      return
    }

    /* WhatsApp triggers */
    if (/whatsapp|watsapp|wa |chat|message us/i.test(lower)) {
      botSay("Opening WhatsApp... 💬 Our team usually replies within minutes!", [], 400)
      setTimeout(() => window.open(`${WA}?text=Hi! I need help with a car battery.`, '_blank'), 700)
      return
    }

    /* Shop navigation */
    if (/shop|browse|catalogue|catalog|all batteries/i.test(lower)) {
      botSay("Taking you to the shop... 🛒", [], 400)
      setTimeout(() => navigate('/shop'), 700)
      return
    }

    /* Warranty page */
    if (/register warranty|warranty page|go to warranty|check warranty status/i.test(lower)) {
      botSay("Opening the warranty page... 🛡️", [], 400)
      setTimeout(() => navigate('/warranty'), 700)
      return
    }

    /* Directions */
    if (/direction|map|google map|get direction/i.test(lower)) {
      botSay("Our branches are on Google Maps 📍 Search **\"Maifa batteries\"** or call the nearest branch for exact directions.", ['Our locations', 'Call Thika Road'])
      return
    }

    /* KB match */
    const match = matchKB(text)
    if (match) { botSay(match.response, match.chips); return }

    fallback()
  }

  const handleSend = (text) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    setChips([])
    setWizard(false)
    addMsg('user', msg)
    processText(msg)
  }

  const handleChip = (chip) => {
    setChips([])
    setWizard(false)
    addMsg('user', chip)

    const c = chip.toLowerCase()

    if (c === 'find my battery' || c === 'recommend a battery' || c === 'recommend another') {
      botSay("What type of vehicle do you have?", [], 500)
      setTimeout(() => setWizard(true), 750)
      return
    }
    if (c.includes('whatsapp')) {
      const presets = {
        'whatsapp us now': 'Hi! I need help with a car battery.',
        'whatsapp us': 'Hi! I need help with a car battery.',
        'whatsapp to order': "Hi! I'd like to order a battery.",
        'whatsapp for trade-in': "Hi! I'd like a quote for my old battery trade-in.",
        'whatsapp for delivery': "Hi! I'd like to arrange battery delivery.",
        'order on whatsapp': "Hi! I'd like to order a battery.",
        'book via whatsapp': "Hi! I'd like to book a battery fitting.",
      }
      const msg = presets[c] || 'Hi! I need help with a car battery.'
      botSay("Connecting you to our team on WhatsApp... 💬", [], 400)
      setTimeout(() => window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank'), 600)
      return
    }
    if (c === 'shop all batteries' || c === 'shop online') { botSay("Taking you to the shop 🛒", [], 400); setTimeout(() => navigate('/shop'), 600); return }
    if (c.startsWith('shop ')) { const cat = chip.slice(5); botSay(`Browsing ${cat} batteries 🔋`, [], 400); setTimeout(() => navigate(`/shop?category=${encodeURIComponent(cat)}`), 600); return }
    if (c === 'register warranty') { botSay("Opening warranty registration 🛡️", [], 400); setTimeout(() => navigate('/warranty'), 600); return }
    if (c === 'check warranty status') { botSay("Opening warranty page 🛡️\n\nEnter your **MFA-XXXX** code to check your status.", [], 400); setTimeout(() => navigate('/warranty'), 700); return }
    if (c === 'get directions') { botSay("Search **\"Maifa batteries\"** on Google Maps, or call the nearest branch for exact directions.", ['Call Thika Road', 'Call Kiambu Road', 'Call Mombasa']); return }
    if (c === 'call thika road') { botSay("Calling Thika Road branch... 📞", [], 300); setTimeout(() => window.location.href = 'tel:+254791899602', 500); return }
    if (c === 'call kiambu road') { botSay("Calling Kiambu Road branch... 📞", [], 300); setTimeout(() => window.location.href = 'tel:+254700777698', 500); return }
    if (c === 'call mombasa') { botSay("Calling Mombasa branch... 📞", [], 300); setTimeout(() => window.location.href = 'tel:+254701880955', 500); return }
    if (c === 'opening hours') { processText('hours'); return }
    if (c === 'find a branch') { processText('location'); return }

    processText(chip)
  }

  const handleVehicle = (v) => {
    setWizard(false)
    addMsg('user', `${v.emoji} ${v.label}`)
    const rec = RECS[v.id]
    botSay(
      `Perfect! For a **${v.label}**, I recommend:\n\n🔋 **${rec.title}**\n• Models: ${rec.models}\n• Price: ${rec.price}\n• Fits: ${rec.fits}\n\n✅ Free installation included with every purchase!`,
      ['Order on WhatsApp', `Shop ${rec.shopCat}`, 'Recommend another', 'Battery prices'],
      900
    )
  }

  return (
    <>
      {/* ── Panel ─────────────────────────────────── */}
      <div className={`cb-panel${open ? ' cb-open' : ''}`} role="dialog" aria-label="Maifa chat assistant">

        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-avatar">M</div>
            <div>
              <div className="cb-title">Maifa Assistant</div>
              <div className="cb-online"><span className="cb-dot" />Online</div>
            </div>
          </div>
          <button className="cb-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="cb-messages">
          {msgs.map(m => (
            <div key={m.id} className={`cb-row cb-${m.from}`}>
              {m.from === 'bot' && <div className="cb-msg-avatar">M</div>}
              {m.from === 'bot'
                ? <div className="cb-bubble" dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
                : <div className="cb-bubble">{m.text}</div>
              }
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="cb-row cb-bot">
              <div className="cb-msg-avatar">M</div>
              <div className="cb-bubble cb-typing"><span /><span /><span /></div>
            </div>
          )}

          {/* Vehicle selector */}
          {wizard && (
            <div className="cb-vehicles">
              {VEHICLE_TYPES.map(v => (
                <button key={v.id} className="cb-vehicle-btn" onClick={() => handleVehicle(v)}>
                  <span className="cb-vehicle-emoji">{v.emoji}</span>
                  <span className="cb-vehicle-label">{v.label}</span>
                  <span className="cb-vehicle-desc">{v.desc}</span>
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Chips */}
        {chips.length > 0 && !wizard && (
          <div className="cb-chips">
            {chips.map(c => (
              <button key={c} className="cb-chip" onClick={() => handleChip(c)}>{c}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="cb-input-row">
          <input
            ref={inputRef}
            type="text"
            className="cb-input"
            placeholder="Ask me anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="cb-send" onClick={() => handleSend()} aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      {/* ── Toggle button ──────────────────────────── */}
      <button
        className={`cb-toggle${open ? ' cb-toggle-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {!open && unread > 0 && <span className="cb-badge">{unread}</span>}
      </button>
    </>
  )
}
