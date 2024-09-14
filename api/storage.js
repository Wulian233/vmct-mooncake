let clickCount = 0;
let rateLimitStore = {};

// 获取点击次数
export async function getClickCount() {
    return clickCount;
}

// 增加点击次数
export async function incrementClickCount() {
    clickCount += 1;
    return clickCount;
}

// 获取速率限制数据
export async function getRateLimitData(ip) {
    return rateLimitStore[ip] || null;
}

// 设置速率限制数据
export async function setRateLimitData(ip, data) {
    rateLimitStore[ip] = data;
}
