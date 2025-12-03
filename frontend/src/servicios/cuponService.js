import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/cupones`;

export const validarCupon = async (codigo, token) => {
  const { data } = await axios.post(
    `${API_URL}/validar`,
    { codigo },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return data;
};

export const usarCupon = async (codigo, token) => {
  const { data } = await axios.post(
    `${API_URL}/usar`,
    { codigo },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return data;
};
