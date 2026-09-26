# 🪔 Vijayadashami & Dussehra Greeting Card Generator 🏹

A luxurious, high-performance, and emotionally warm Dussehra / Vijayadashami Greeting Card Generator web application built with **HTML5, CSS3, Vanilla JavaScript, Python Flask, and Pillow**.

Designed for real-world festival greetings, WhatsApp sharing, and high-resolution 1080×1350 (4:5 ratio) card downloads.

---

## ✨ Features

- 🎨 **3 Premium Royal Templates**:
  - **Royal Gold**: Deep royal maroon canvas with antique gold mandalas and filigree borders.
  - **Divine Light**: Dark ebony background with celestial golden sunburst light rays and temple arch.
  - **Festive Heritage**: Deep crimson velvet background with traditional kalash motifs and marigold garlands.
- ⚡ **Real-Time Live Card Preview**: Instantly updates recipient name, sender name, message, typography, and theme without refreshing the page.
- 🖼️ **Dual High-Resolution PNG Downloads**:
  - **Client-Side Canvas Export**: Lightning-fast in-browser rendering at 1080×1350 px.
  - **Server-Side Pillow HD Export**: Python Pillow route (`/api/generate-card`) for server-side image generation.
- 💬 **WhatsApp & Social Media Sharing**: One-click personalized WhatsApp message generator and instant text clipboard copying.
- 🪔 **Interactive Visual Controls**: Toggle Diya flame flicker animations, golden particle sparkles, and gold foil shimmer effects.
- 📱 **Mobile First & Responsive**: Optimized touch-friendly controls and scale-fitted 4:5 aspect ratio card preview for all devices.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), HTML5 Canvas API
- **Backend**: Python 3.12, Flask 3.0+
- **Image Processing**: Pillow (PIL) 10.0+
- **Typography**: Google Fonts (*Rozha One, Cinzel, Cormorant Garamond, Poppins, Tiro Devanagari Hindi*)
- **Icons**: FontAwesome 6.4

---

## 📁 Directory Structure

```text
c:\Users\bobby\OneDrive\Desktop\Devi_Wishing_Card\
├── app.py                  # Flask backend with routes & Pillow generator
├── requirements.txt        # Python dependencies (Flask, Pillow, gunicorn)
├── README.md               # Documentation
├── templates/
│   └── index.html          # Main application semantic HTML5 template
└── static/
    ├── css/
    │   └── style.css       # Royal Indian festival design system & animations
    ├── js/
    │   └── script.js       # Live preview engine, canvas renderer, share & toggles
    ├── images/
    │   ├── hero_banner.jpg # Hero section cinematic artwork
    │   ├── royal_gold_bg.jpg      # Template 1 background
    │   ├── divine_light_bg.jpg    # Template 2 background
    │   └── festive_heritage_bg.jpg# Template 3 background
    └── fonts/
        ├── RozhaOne-Regular.ttf
        ├── Poppins-Regular.ttf
        ├── Poppins-SemiBold.ttf
        └── Poppins-Bold.ttf
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Flask Server
```bash
python app.py
```

### 3. Open in Browser
Navigate to:
```text
http://127.0.0.1:5000
```

---

## 📡 API Endpoints

### `POST /api/generate-card`
Generates a 1080×1350 px PNG greeting card using Pillow.

**Request Body (JSON)**:
```json
{
  "recipient": "Dear Family & Friends",
  "sender": "Dan Babi",
  "message": "On this auspicious Vijayadashami, may the light of goodness shine brightly...",
  "template": "royal_gold"
}
```

**Response**:
- Binary `image/png` file attachment (`Dussehra_Greeting_Card.png`).

---

## 📜 License
Crafted for Vijayadashami & Dussehra celebrations. Open for portfolio and personal greeting use.
