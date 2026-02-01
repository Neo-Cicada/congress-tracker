import 'dotenv/config';
import axios from 'axios';

const debugApi = async () => {
    const token = process.env.CONGRESS_API_KEY;
    const baseUrl = process.env.CONGRESS_API_BASE_URL || 'https://api.quiverquant.com/beta';

    console.log('Testing Quiver API connection...');
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Token present: ${!!token}`);

    try {
        const url = `${baseUrl}/bulk/congresstrading`;
        console.log(`Requesting: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        console.log(`Status: ${response.status}`);
        console.log(`Data type: ${typeof response.data}`);
        console.log(`Data length: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('First item sample:', response.data[0]);
        } else {
            console.log('Full Data:', response.data);
        }

    } catch (error: any) {
        console.error('API Error:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

debugApi();
