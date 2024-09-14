import { getClickCount } from './storage';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const count = await getClickCount();
        return res.status(200).json({ count });
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
