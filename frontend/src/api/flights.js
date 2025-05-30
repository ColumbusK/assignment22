import axios from "axios";
const API_BASE_URL = "/api";
export const searchFlights = async (from, to, date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights/search`, {
      params: { from, to, date },
    });
    return response.data; // Assuming the API returns an array of flights
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const getAllFlights = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights`);
    return response.data; // Assuming the API returns an array of flights
  } catch (error) {
    console.error("Error fetching all flights:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const getFlightById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flight by ID:", error);
    throw error;
  }
};
