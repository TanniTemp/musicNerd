import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export const getSpotifyToken = async (): Promise<string | null> => {
  const clientId = process.env.SPOTIFY_CLIENT_ID; 
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  

  const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'client_credentials',
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    return response.data.access_token; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching Spotify token:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};
