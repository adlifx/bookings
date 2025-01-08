import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    'https://mcydsuauxzizmlxxcqpy.supabase.co', // Replace with your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWRzdWF1eHppem1seHhjcXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjc5ODgsImV4cCI6MjA1MTkwMzk4OH0.v-MRKBCN37TaJPNgXuUTh3GRtcjyNhSehdn9pGh4ZRw' // Replace with your Supabase public API key
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, title, description, date, time } = req.body;

        try {
            // Check for conflicts
            const { data: conflicts, error: conflictError } = await supabase
                .from('bookings')
                .select('*')
                .eq('date', date)
                .eq('time', time);

            if (conflictError) throw new Error('Error checking availability');
            if (conflicts.length > 0) {
                return res.status(400).json({ error: 'This slot is already booked.' });
            }

            // Insert new booking
            const { error } = await supabase.from('bookings').insert([
                { name, title, description, date, time },
            ]);

            if (error) throw new Error('Error saving booking');

            res.status(200).json({ message: 'Booking successful!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
