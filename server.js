const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const supabase = createClient(
    'https://mcydsuauxzizmlxxcqpy.supabase.co', // Your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWRzdWF1eHppem1seHhjcXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjc5ODgsImV4cCI6MjA1MTkwMzk4OH0.v-MRKBCN37TaJPNgXuUTh3GRtcjyNhSehdn9pGh4ZRw' // Your Supabase Key
);

app.post('/api/book', async (req, res) => {
    const { name, title, description, date, time } = req.body;

    try {
        // Check for conflicts
        const { data: conflicts } = await supabase
            .from('bookings')
            .select('*')
            .eq('date', date)
            .eq('time', time);

        if (conflicts.length > 0) {
            return res.status(400).json({ error: 'This slot is already booked.' });
        }

        // Insert booking
        const { error } = await supabase.from('bookings').insert([
            { name, title, description, date, time }
        ]);

        if (error) throw error;

        res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
