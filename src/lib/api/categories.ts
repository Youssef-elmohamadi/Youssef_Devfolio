import axios from "axios";

type Category = { id: number; name: string; slug?: string };

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get(`${BASE_URL}/api/categories`);
  return data;
};

export const createCategory = async (payload: Partial<Category>) => {
  return await axios.post(`${BASE_URL}/api/categories`, payload);
};

export const updateCategory = async (id: number, payload: Partial<Category>) => {
  return await axios.put(`${BASE_URL}/api/categories/${id}`, payload);
};

export const deleteCategory = async (id: number) => {
  return await axios.delete(`${BASE_URL}/api/categories/${id}`);
};
