import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUserStreak = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData).user_id : null;
        
        if (!userId) throw new Error('User ID not found');

        const response = await axios.get(`${BASE_URL_AUTH}/v1/journey/streak/${userId}`);
        return response.data.streak;
    } catch (error) {
        console.error('Error fetching streak:', error);
        return 0;
    }
};
