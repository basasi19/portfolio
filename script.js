document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const modal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const modalTitle = document.getElementById("modalTitle");
const closeButton = document.querySelector(".modal-close");
const youtubePlayer = document.getElementById("youtubePlayer");
const youtubeFrame = document.getElementById("youtubeFrame");
const youtubeLink = document.getElementById("youtubeLink");
let videoTrigger = null;
let previousOverflow = "";

function clearMedia() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modalVideo.hidden = true;
  youtubeFrame.removeAttribute("src");
  youtubePlayer.hidden = true;
}

function openVideo(button) {
  clearMedia();
  videoTrigger = button;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  modalTitle.textContent = button.dataset.title || "参考動画";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  closeButton.focus({ preventScroll: true });

  if (button.dataset.youtube) {
    const videoId = button.dataset.youtube;
    youtubeFrame.title = button.dataset.title + " — YouTube動画";
    youtubeLink.href = "https://www.youtube.com/watch?v=" + videoId;
    youtubePlayer.hidden = false;
    youtubeFrame.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&playsinline=1&rel=0";
  } else {
    modalVideo.hidden = false;
    modalVideo.src = button.dataset.video;
    modalVideo.load();
    modalVideo.play().catch(() => {});
  }
}

function closeVideo() {
  if (!modal.classList.contains("is-open")) return;
  clearMedia();
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousOverflow;
  videoTrigger?.focus({ preventScroll: true });
}

document.querySelectorAll(".work-thumb").forEach((button) => {
  button.addEventListener("click", () => openVideo(button));
});
closeButton.addEventListener("click", closeVideo);
modal.addEventListener("click", (event) => {
  if (event.target.dataset.close === "true") closeVideo();
});
document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeVideo();
  if (event.key === "Tab") {
    const controls = [...modal.querySelectorAll("button, a[href], video, iframe")]
      .filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const contactSuccess = document.getElementById("contactSuccess");
if (contactSuccess && new URLSearchParams(window.location.search).get("message") === "sent") {
  contactSuccess.hidden = false;
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("message");
  window.history.replaceState(null, "", cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
}
