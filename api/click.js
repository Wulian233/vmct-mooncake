import { rateLimit } from './rateLimit';
import { getClickCount, incrementClickCount } from './storage';

export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (req.method === 'POST') {
        // 进行速率限制与点击模式分析
        const result = await rateLimit(ip);

        if (result.isBlocked) {
            // 返回错误信息（过于频繁）
            return res.status(429).json({ message: result.message });
        }

        // 增加点击计数
        const newCount = await incrementClickCount();
        return res.status(200).json({ count: newCount });
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
