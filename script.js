// Thay lời chúc trong #love-letter để gửi những kỷ niệm riêng của hai bạn.
// Photo buttons keep the original portraits intact; the dialog supports Escape.
const photoDialog = document.getElementById("photo-dialog");
document.querySelectorAll(".photo-button").forEach((button) => {
  button.addEventListener("click", () => {
    const source = button.querySelector("img");
    const fullPhoto = document.getElementById("full-photo");
    fullPhoto.src = source.currentSrc || source.src;
    fullPhoto.alt = source.alt;
    document.getElementById("full-photo-caption").textContent = button
      .closest("figure")
      .querySelector("figcaption").textContent;
    photoDialog.showModal();
  });
});
photoDialog.addEventListener("click", (event) => {
  const bounds = photoDialog.getBoundingClientRect();
  if (
    event.target === photoDialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    photoDialog.close();
});
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        observer.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
const letterButton = document.getElementById("open-letter");
letterButton.addEventListener("click", () => {
  letterButton.disabled = true;
  letterButton.classList.add("open");
  letterButton.setAttribute("aria-expanded", "true");
  setTimeout(
    () => {
      letterButton.hidden = true;
      letterButton.style.display = "none";
      document.getElementById("love-letter").classList.add("visible");
      celebrate(65);
    },
    reducedMotion ? 0 : 550,
  );
});
let toastTimer;
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
}
const canvas = document.getElementById("confetti"),
  ctx = canvas.getContext("2d");
let particles = [],
  frame = 0;
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
addEventListener("resize", resize);
function celebrate(count = 180) {
  if (reducedMotion) return;
  const colors = ["#ac5967", "#d994a0", "#dfb76b", "#f5d3b3", "#927c9c"];
  for (let i = 0; i < count; i++)
    particles.push({
      x: innerWidth * 0.5,
      y: innerHeight * 0.65,
      vx: (Math.random() - 0.5) * 18,
      vy: -Math.random() * 17 - 4,
      g: 0.12 + Math.random() * 0.08,
      size: 3 + Math.random() * 5,
      rotation: Math.random() * 6,
      spin: (Math.random() - 0.5) * 0.2,
      life: 150 + Math.random() * 70,
      color: colors[Math.floor(Math.random() * colors.length)],
      heart: Math.random() > 0.7,
    });
  if (!frame) frame = requestAnimationFrame(draw);
}
function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter((p) => p.life > 0 && p.y < innerHeight + 30);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.vx *= 0.993;
    p.rotation += p.spin;
    p.life--;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.min(1, p.life / 35);
    ctx.fillStyle = p.color;
    if (p.heart) {
      ctx.font = p.size * 2 + "px Georgia";
      ctx.fillText("♥", 0, 0);
    } else ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
    ctx.restore();
  });
  if (particles.length) frame = requestAnimationFrame(draw);
  else {
    frame = 0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}
const cake = document.getElementById("cake"),
  arch = document.querySelector(".arch");
cake.setAttribute("role", "button");
cake.setAttribute("tabindex", "0");
cake.setAttribute(
  "aria-label",
  "Thổi nến trên bánh sinh nhật và ngắm pháo hoa",
);
const fireworks = document.createElement("div");
fireworks.className = "fireworks-layer";
fireworks.setAttribute("aria-hidden", "true");
arch.prepend(fireworks);
const hint = document.createElement("div");
hint.className = "cake-hint";
hint.textContent = "CHẠM VÀO BÁNH ĐỂ THỔI NẾN ♡";
arch.appendChild(hint);
function makeFirework(x, y, color, delay = 0, once = false) {
  const burst = document.createElement("div");
  burst.className = "firework" + (once ? " celebration" : "");
  burst.style.left = x + "%";
  burst.style.top = y + "%";
  burst.style.setProperty("--spark-color", color);
  burst.style.setProperty("--delay", delay + "s");
  for (let i = 0; i < 20; i++) {
    const spark = document.createElement("i");
    spark.style.setProperty("--angle", i * 18 + "deg");
    spark.style.setProperty("--distance", -(35 + (i % 2) * 18) + "px");
    burst.appendChild(spark);
  }
  fireworks.appendChild(burst);
  if (once) setTimeout(() => burst.remove(), 1800);
}
if (!reducedMotion) {
  makeFirework(24, 31, "#fff6ce", 0);
  makeFirework(77, 39, "#b96782", 0.95);
  makeFirework(56, 22, "#fff2d7", 1.85);
  const fireworksObserver = new IntersectionObserver((entries) => {
    fireworks
      .querySelectorAll("i")
      .forEach(
        (s) =>
          (s.style.animationPlayState = entries[0].isIntersecting
            ? "running"
            : "paused"),
      );
  });
  fireworksObserver.observe(arch);
}
function blowCandles() {
  cake.classList.add("blown");
  hint.textContent = "SINH NHẬT VUI VẺ, VỢ YÊU! ♡";
  document.getElementById("wish-status").textContent =
    "Mong mọi điều tốt đẹp sẽ tìm đến em. Sinh nhật vui vẻ, vợ yêu! ♡";
  document.getElementById("blow").innerHTML =
    'Gửi thêm một chút yêu thương <span aria-hidden="true">♡</span>';
  celebrate();
  if (!reducedMotion) {
    makeFirework(20, 40, "#fff7cd", 0, true);
    makeFirework(80, 28, "#bc6184", 0, true);
    makeFirework(50, 18, "#fff7cd", 0, true);
  }
  toast("Chúc mọi điều ước của em thành hiện thực ♡");
}
document.getElementById("blow").addEventListener("click", blowCandles);
cake.addEventListener("click", blowCandles);
cake.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    blowCandles();
  }
});
if (!reducedMotion) {
  setInterval(() => {
    if (document.hidden) return;
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♡";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 12 + Math.random() * 14 + "px";
    heart.style.opacity = 0.15 + Math.random() * 0.2;
    heart.style.animationDuration = 10 + Math.random() * 7 + "s";
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }, 2300);
}
// File nhạc có giọng hát phát trực tiếp, không phụ thuộc trình phát quảng cáo.
const musicButton = document.getElementById("music"),
  songStatus = document.getElementById("song-status"),
  birthdayAudio = document.getElementById("birthday-audio");
let wantsMusic = true,
  resumeAfterHidden = false,
  playPending = false;
birthdayAudio.volume = 0.65;
musicButton.title = "It’s Your Birthday! · Monk Turner + Fascinoma";
function updateMusicButton() {
  const playing = !birthdayAudio.paused;
  musicButton.classList.toggle("playing", playing);
  musicButton.setAttribute("aria-pressed", String(playing));
  musicButton.setAttribute(
    "aria-label",
    playing ? "Tạm dừng nhạc sinh nhật" : "Phát nhạc sinh nhật",
  );
}
function removeMusicUnlock() {
  document.removeEventListener("pointerdown", unlockSong);
  document.removeEventListener("keydown", unlockSong);
}
async function playSong() {
  wantsMusic = true;
  playPending = true;
  try {
    await birthdayAudio.play();
    if (!wantsMusic) birthdayAudio.pause();
  } catch (error) {
    if (error.name === "NotAllowedError")
      songStatus.textContent = "Chạm vào trang hoặc nhấn ♫ để bật nhạc nhé.";
    else if (error.name !== "AbortError")
      songStatus.textContent =
        "Chưa tải được nhạc. Bạn kiểm tra mạng và thử lại nhé.";
  } finally {
    playPending = false;
    updateMusicButton();
  }
}
function unlockSong(event) {
  if (
    event.target instanceof Element &&
    event.target.closest("#music, .audio-card")
  )
    return;
  if (wantsMusic && birthdayAudio.paused) playSong();
}
musicButton.addEventListener("click", () => {
  if (!birthdayAudio.paused || playPending) {
    wantsMusic = false;
    birthdayAudio.pause();
    removeMusicUnlock();
  } else playSong();
  updateMusicButton();
});
birthdayAudio.addEventListener("playing", () => {
  removeMusicUnlock();
  updateMusicButton();
  songStatus.textContent = "Đang phát: It’s Your Birthday! ♫";
});
birthdayAudio.addEventListener("pause", () => {
  updateMusicButton();
  songStatus.textContent = "Đã tạm dừng · Nhấn ♫ để nghe tiếp.";
  if (!document.hidden) {
    wantsMusic = false;
    removeMusicUnlock();
  }
});
birthdayAudio.addEventListener("error", () => {
  updateMusicButton();
  songStatus.textContent =
    "Không tải được file nhạc. Bạn tải lại trang hoặc kiểm tra mạng nhé.";
});
document.addEventListener("pointerdown", unlockSong);
document.addEventListener("keydown", unlockSong);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resumeAfterHidden = !birthdayAudio.paused;
    if (resumeAfterHidden) birthdayAudio.pause();
  } else if (resumeAfterHidden) {
    resumeAfterHidden = false;
    playSong();
  }
});
playSong();
