export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase.from('bookings').select('date, time, title');
            if (error) throw new Error(error.message);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
