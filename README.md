# 🇮🇳 INDIA-GIS

A professional, full-stack Web GIS Application focused on India, providing advanced mapping, spatial analysis, and engineering capabilities.

## 🚀 Overview

**INDIA-GIS** is a Google-Maps-like platform tailored for the Indian landscape. It integrates high-quality geospatial data with professional GIS tools, allowing users to visualize infrastructure, perform spatial measurements, and manage complex layers like Metro networks, Railways, and Administrative boundaries.

## ✨ Core Features

### 🗺️ Interactive Mapping
- **Multiple Basemaps**: Toggle between standard Streets (OSM) and high-resolution Satellite (Esri) views.
- **Smart Search**: Intelligent location searching for Indian cities, transport hubs, and landmarks.
- **Live Geolocation**: Real-time GPS tracking to show and zoom to the user's current position.

### 🧭 Professional GIS Layers
- **Administrative**: India Boundary, State Boundaries, and District Boundaries.
- **Transportation**: Real-time mock data for Metro Networks, Railways, and Airports.
- **Infrastructure**: Specialized rendering for facilities like Hospitals and Schools.

### 📍 Engineering & Analysis Tools (Powered by Geoman)
- **Geometry Drawing**: Create Points, Lines, Polygons, and Circles directly on the map.
- **Spatial Measurement**: Accurate distance and area calculations with visual popups.
- **Data Management**: Ability to "Clear All" or edit existing geometries on the fly.
- **GIS Uploads**: Backend support for processing Shapefiles (.shp), GeoJSON, and KML (Coming soon to UI).

## 🛠️ Tech Stack

### Frontend (React)
- **Leaflet & React-Leaflet**: Core mapping engine.
- **Tailwind CSS v4**: Modern, premium UI styling with glassmorphism.
- **Lucide-React**: High-quality vector icons.
- **Geoman**: Advanced GIS drawing and editing framework.
- **Axios**: Robust API communication.

### Backend (Node.js & Express)
- **Express**: Fast, unopinionated web framework.
- **Turf.js**: Advanced geospatial engine for spatial analysis.
- **Multer**: Middleware for handling GIS file uploads.
- **Shapefile**: Parsing logic for .shp to GeoJSON conversion.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (optional for persistence)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd india-gis
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```
*The server will run on [http://localhost:5000](http://localhost:5000)*

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*The web app will be available on [http://localhost:5173](http://localhost:5173)* (or next available port)

## 📁 Project Structure

```text
india-gis/
├── frontend/
│   ├── src/
│   │   ├── components/  # Sidebar, Map, Search, Layers, Toolbar
│   │   ├── services/    # API connection logic
│   │   └── data/        # Static GeoJSON local storage
├── backend/
│   ├── routes/          # API Endpoint definitions
│   ├── controllers/     # Business logic
│   ├── services/        # GIS & Spatial processing
│   └── data/            # GeoJSON boundary data
└── README.md            # You are here
```

## 🤝 Contributing
Contributions are welcome! If you're building specific Indian GIS datasets (State-wise utility lines, etc.), feel free to open a PR.

---
**INDIA-GIS** • Developed for Professional Geospatial Analysis 🇮🇳
