import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    'https://mcydsuauxzizmlxxcqpy.supabase.co', // Your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWRzdWF1eHppem1seHhjcXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjc5ODgsImV4cCI6MjA1MTkwMzk4OH0.v-MRKBCN37TaJPNgXuUTh3GRtcjyNhSehdn9pGh4ZRw' // Your Supabase API key
);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch booked slots from Supabase
            const { data, error } = await supabase.from('bookings').select('date, time, title');
            if (error) throw new Error(error.message);

            // Return the fetched data
            res.status(200).json(data);
        } catch (error) {
            // Return an error response
            res.status(500).json({ error: error.message });
        }
    } else {
        // Method not allowed
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
