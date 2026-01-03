import { BASE_URL_AUTH } from "./baseUrls";

interface SaveTokenRequest {
  fcmToken: string;
  userId: string;
  name: string;
}

export const saveNotificationToken = async (data: SaveTokenRequest) => {
  const response = await fetch(`${BASE_URL_AUTH}/v1/notifications/save-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save notification token');
  }

  return response.json();
};
