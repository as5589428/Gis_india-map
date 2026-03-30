import axios from 'axios';

const API_BASE_URL = 'https://gis-india-map.onrender.com/api';

// Search API
export const searchLocations = (query) => {
  return axios.get(`${API_BASE_URL}/search`, { params: { query } });
};

// Layer API
export const getLayers = () => {
  return axios.get(`${API_BASE_URL}/layers`);
};

export const getLayerGeoJSON = (layerId) => {
  return axios.get(`${API_BASE_URL}/layers/${layerId}`);
};

// GIS API
export const uploadGISFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE_URL}/gis/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const analyzeGISData = (geojson, action) => {
  return axios.post(`${API_BASE_URL}/gis/analyze`, { geojson, action });
};
