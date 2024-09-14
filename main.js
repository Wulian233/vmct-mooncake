const sound = new Howl({
  src: ['./assets/sound.mp3']
});

const bgm = new Howl({
  src: [
      "https://music.163.com/song/media/outer/url?id=1983466731.mp3",
  ],
  html5: true,
  loop: true,
  volume: 0.2,
});

var ringId = 0;
var bgmId = 0;
let countElements = document.querySelectorAll(".count");
var mooncakeElements = document.querySelectorAll(".mooncake");

function startAnimate() {
  countElements.forEach(function (element) {
      element.style.transform = "scale(1.05)";
  });

  mooncakeElements.forEach(function (element) {
      element.style.transform = "scale(0.95)";
  });
}

function initAnimate() {
  countElements.forEach(function (element) {
      element.style.transform = "scale(1)";
  });

  mooncakeElements.forEach(function (element) {
      element.style.transform = "scale(1)";
  });
}

// 新的点击计数器逻辑
async function counter() {
  try {
      // 发送请求到点击 API
      const response = await fetch('/api/click', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
          startAnimate();
          countElements.forEach(function (element) {
              element.innerHTML = data.count;
          });

          if (ringId !== 0) {
              if (sound.playing()) {
                  sound.stop(ringId);
              }
              ringId = sound.play();
          } else {
              ringId = sound.play();
          }
      } else {
          alert(data.message || '请求过于频繁，请稍后再试。');
      }
  } catch (error) {
      console.error('计数请求失败', error);
  }
}

// 获取初始点击次数
async function getInitialCount() {
  try {
      const response = await fetch('/api/count');
      const data = await response.json();
      countElements.forEach(function (element) {
          element.innerHTML = data.count;
      });
  } catch (error) {
      console.error('获取点击次数失败', error);
  }
}

getInitialCount(); // 页面加载时获取初始点击次数

// 空格键触发点击计数
document.addEventListener('keydown', function (e) {
  if (e.key === " ") {
      counter();
  }
});

var mooncake = document.querySelector('.mooncake');

// 点击月饼触发计数
if (typeof window.orientation !== 'undefined') {
  mooncake.addEventListener('touchstart', function () {
      counter();
  });

  mooncake.addEventListener('touchmove', function () {
      initAnimate();
  });

  mooncake.addEventListener('touchend', function () {
      initAnimate();
  });
} else {
  mooncake.addEventListener('mouseup', function () {
      initAnimate();
  });

  mooncake.addEventListener('mousedown', function () {
      counter();
  });
}

// 点击Logo控制背景音乐播放/暂停
var logo = document.querySelector('.logo');

logo.addEventListener('click', function () {
  if (bgm.playing() && bgm.state().toString() === "loaded") {
      bgm.pause(bgmId);
  } else {
      if (bgmId !== 0) {
          bgm.play(bgmId);
      } else {
          bgmId = bgm.play();
      }
  }
});
