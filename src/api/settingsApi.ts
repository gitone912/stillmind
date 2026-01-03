import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';

interface UpdateSettingsPayload {
    userId: string;
    voiceType: string;
    language: string;
    therapyType: string;
}

interface UpdateSettingsResponse {
    message: string;
    settings: {
        voice_type: string;
        language: string;
        therapy_type: string;
        updated_at: string;
    };
}

export const updateSettings = async (
    userId: string,
    voiceType: string,
    language: string,
    therapyType: string
): Promise<UpdateSettingsResponse> => {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/settings/update`, {
        userId,
        voiceType,
        language,
        therapyType
    });
    return response.data;
};
