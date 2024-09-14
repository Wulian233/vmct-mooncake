import { getRateLimitData, setRateLimitData } from './storage';

const MAX_CLICKS_PER_WINDOW = 8; // 定义在某个时间窗口内的最大点击数
const TIME_WINDOW = 3000; // 定义时间窗口（3秒）

export async function rateLimit(ip) {
    const now = Date.now();
    const limitData = await getRateLimitData(ip);

    if (limitData) {
        const { timestamps } = limitData;
        const filteredTimestamps = timestamps.filter(ts => now - ts < TIME_WINDOW);

        // 更新点击时间戳
        filteredTimestamps.push(now);

        // 如果在时间窗口内点击次数超过阈值，判定为连点器
        if (filteredTimestamps.length > MAX_CLICKS_PER_WINDOW) {
            // 设置阻止信息（过于频繁）
            await setRateLimitData(ip, { timestamps: filteredTimestamps });
            return { isBlocked: true, message: "请求过于频繁，疑似连点器，请稍后再试。" };
        }

        // 正常更新
        await setRateLimitData(ip, { timestamps: filteredTimestamps });
        return { isBlocked: false };
    }

    // 第一次点击，初始化数据
    await setRateLimitData(ip, { timestamps: [now] });
    return { isBlocked: false };
}
