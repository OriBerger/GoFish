import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

// Create an instance of Axios for handling API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header for protected routes
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handler function
const handleError = (error: any) => {
  if (error.response) {
    console.error("Error response:", error.response.data);
  } else if (error.request) {
    console.error("No response from server:", error.request);
  } else {
    console.error("Request error:", error.message);
  }
  throw error;
};

// API Requests

// Sign-Up
export const signup = async (userData: object) => {
  try {
    const response = await apiClient.post("/signup", userData);
    // Store token in local storage after successful login
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Login
export const login = async (credentials: object) => {
  try {
    const response = await apiClient.post("/login", credentials);
    // Store token in local storage after successful login
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a contact (protected)
export const createContact = async (contactData: object) => {
  try {
    const response = await apiClient.post("/contacts", contactData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch contacts with pagination (protected)
export const fetchContacts = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get(
      `/contacts?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit a contact (protected)
export const editContact = async (contactId: string, contactData: object) => {
  try {
    const response = await apiClient.put(`/contacts`, {
      contactId,
      ...contactData,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete a contact (protected)
export const deleteContact = async (contactId: string) => {
  try {
    const response = await apiClient.delete(`/contacts`, {
      data: { contactId },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
