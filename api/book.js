import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    'https://mcydsuauxzizmlxxcqpy.supabase.co', // Your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWRzdWF1eHppem1seHhjcXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjc5ODgsImV4cCI6MjA1MTkwMzk4OH0.v-MRKBCN37TaJPNgXuUTh3GRtcjyNhSehdn9pGh4ZRw' // Your Supabase public API key
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, title, description, date, time } = req.body;

        // Log incoming data for debugging
        console.log('Incoming data:', { name, title, description, date, time });

        try {
            // Check for conflicts
            const { data: conflicts, error: conflictError } = await supabase
                .from('bookings')
                .select('*')
                .eq('date', date)
                .eq('time', time);

            if (conflictError) {
                console.error('Error checking availability:', conflictError);
                throw new Error('Error checking availability');
            }

            if (conflicts.length > 0) {
                console.warn('Conflict found:', conflicts);
                return res.status(400).json({ error: 'This slot is already booked.' });
            }

            // Insert new booking
            const { data, error } = await supabase.from('bookings').insert([
                { name, title, description, date, time },
            ]);

            if (error) {
                console.error('Error saving booking:', error);
                throw new Error('Error saving booking');
            }

            console.log('Booking inserted successfully:', data);

            res.status(200).json({ message: 'Booking successful!' });
        } catch (error) {
            console.error('Handler error:', error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
