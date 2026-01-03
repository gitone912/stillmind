import axios from 'axios';
import { BASE_URL_AUTH } from "./baseUrls";

export interface MindData {
  created_at: string;
  insight: string;
  mind_id: string;
  title: string;
  user_id: string;
}

export const fetchMindData = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL_AUTH}/v1/mind/all/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
