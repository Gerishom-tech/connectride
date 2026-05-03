# 🛵 ConnectRide
## Smarter Rides Through Network Intelligence

> **Africa Ignite Hackathon 2026 — Theme 4: Mobility, Transport & Urban Services**
> Built by **Gerishom Nshimyimana** — Kigali, Rwanda 🇷🇼

---

## 🌐 Live Demo
👉 **https://connectride.onrender.com/login.html**

## 💻 GitHub
👉 **https://github.com/Gerishom-tech/connectride**

---

## 🚨 The Problem

In Kigali and across Sub-Saharan Africa, ride-hailing platforms assign drivers **without any real-time network verification**:

- ❌ Missed pickups due to GPS spoofing
- ❌ Dropped calls mid-trip in low-coverage zones
- ❌ Failed deliveries in hilly areas like Gasabo
- ❌ Poor passenger experience and lost revenue

**This costs ride-hailing platforms millions in failed trips every year.**

---

## 💡 The Solution

**ConnectRide** is a network-aware smart dispatch middleware that runs **4 real-time CAMARA API checks** on every driver before assigning a ride:

| # | Check | API | Purpose |
|---|---|---|---|
| 1 | 📍 Location Verification | CAMARA Location API | Confirms driver is where app says |
| 2 | 📶 Device Status | CAMARA Device Status API | Checks network stability |
| 3 | 🚀 QoS on Demand | CAMARA QoS API | Boosts network for trip duration |
| 4 | 🔐 SIM Swap Detection | CAMARA SIM Swap API | Prevents identity fraud |

Only drivers who **pass all 4 checks** get assigned. If network drops mid-trip, system auto-reroutes to next qualified driver.

---

## 🤖 Agentic AI Layer

An intelligent AI orchestrator that:
- Calculates real-time **dispatch readiness scores** (0-100)
- Learns city coverage patterns by zone and time of day
- Pre-emptively boosts QoS for drivers heading into low-coverage areas
- Explains every dispatch decision in plain English

---

## 🌍 6 Cities Supported

| City | Country | Operators | Currency |
|---|---|---|---|
| Kigali | 🇷🇼 Rwanda | MTN + Airtel Rwanda | RWF |
| Nairobi | 🇰🇪 Kenya | Safaricom + Airtel Kenya | KES |
| Lagos | 🇳🇬 Nigeria | MTN + Airtel + Glo Nigeria | NGN |
| Kampala | 🇺🇬 Uganda | MTN + Airtel Uganda | UGX |
| Accra | 🇬🇭 Ghana | MTN + Vodafone Ghana | GHS |
| Dar es Salaam | 🇹🇿 Tanzania | Vodacom + Airtel Tanzania | TZS |

---

## 🏗️ Technical Architecture

```
Passenger Request
      ↓
ConnectRide Middleware (Node.js)
      ↓
Nokia Network as Code Platform
      ├── 📍 Location Verification API
      ├── 📶 Device Status API
      ├── 🚀 QoS on Demand API
      └── 🔐 SIM Swap API
      ↓
🤖 AI Dispatch Engine (Claude AI)
      ↓
Best Driver Assigned ✅
```

---

## 📱 App Views

| View | Description | Access |
|---|---|---|
| 🔐 Login | Role-based login + register | /login.html |
| 👤 Passenger | Request rides across 6 cities | /passenger.html |
| 🛵 Driver | Network score + incoming rides | /driver.html |
| 📊 Operator | Live dispatch dashboard | /index.html |
| 💰 MNO Portal | Revenue tracking for operators | /mno.html |

### Demo Accounts

| Email | Password | Role | City |
|---|---|---|---|
| passenger@connectride.com | demo123 | Passenger | Kigali 🇷🇼 |
| driver@connectride.com | demo123 | Driver | Kigali 🇷🇼 |
| operator@connectride.com | demo123 | Operator | Kigali 🇷🇼 |
| nairobi@connectride.com | demo123 | Operator | Nairobi 🇰🇪 |
| lagos@connectride.com | demo123 | Operator | Lagos 🇳🇬 |
| kampala@connectride.com | demo123 | Operator | Kampala 🇺🇬 |
| accra@connectride.com | demo123 | Operator | Accra 🇬🇭 |
| darsalaam@connectride.com | demo123 | Operator | Dar es Salaam 🇹🇿 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Anthropic API key (optional — fallback works without it)

### Installation

```bash
git clone https://github.com/Gerishom-tech/connectride.git
cd connectride
npm install
```

### Configuration

Create a `.env` file:
```
PORT=3000
ANTHROPIC_API_KEY=your_key_here
```

### Run

```bash
node src/server.js
```

Open **http://localhost:3000/login.html**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/dispatch/drivers?city=Kigali` | Get drivers by city |
| POST | `/api/dispatch/check` | Run dispatch check |
| GET | `/api/dispatch/cities` | Get all supported cities |

### Example Request

```bash
POST /api/dispatch/check
{
  "pickup": "Kimironko Market",
  "dropoff": "Kigali Convention Centre",
  "city": "Kigali"
}
```

---

## 💰 Business Model

- **Per-dispatch API fee** charged to ride-hailing platforms
- **Revenue sharing** with MNOs on every QoS boost
- **B2B SaaS** — integrate via simple REST API
- **Scalable** to any SSA city with ride-hailing

---

## 📊 Expected Impact

- 80% reduction in failed rides due to connectivity loss
- Improved driver and passenger trust across SSA
- New revenue stream for Mobile Network Operators
- Scalable across all SSA cities

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Backend server |
| Nokia Network as Code SDK | CAMARA API platform |
| Claude AI (Anthropic) | Intelligent dispatch decisions |
| HTML/CSS/JavaScript | Frontend dashboard |
| GitHub | Code repository |
| Render.com | Cloud hosting |

---

## 👤 Team

**Gerishom Nshimyimana** — Innovator
📍 Kigali, Rwanda 🇷🇼
🎓 University of Rwanda, Urban and Regional Planning student

---

*Built with ❤️ in Kigali, Rwanda*
*Nokia Network as Code • CAMARA APIs • Africa Ignite Hackathon 2026*
 Nokia • Vodafone • MTN • Orange • GSMA*