const sliders = ["alignment", "evidence", "budget", "voice"].map((id) => document.getElementById(id));
const scoreEl = document.getElementById("score");
const ratingEl = document.getElementById("rating");
const recommendationEl = document.getElementById("recommendation");
const notesEl = document.getElementById("demo-notes");
const ringEl = document.querySelector(".score-ring");

function updateReadiness() {
  const [alignment, evidence, budget, voice] = sliders.map((slider) => Number(slider.value));
  const score = Math.round(alignment * 0.34 + evidence * 0.26 + budget * 0.2 + voice * 0.2);
  const notes = [];

  if (alignment >= 84) notes.push("Funder priorities are strongly reflected in the proposal frame.");
  else notes.push("Add clearer funder-priority language before final review.");

  if (evidence >= 80) notes.push("Evidence base is credible enough for an executive summary.");
  else notes.push("Strengthen outcomes evidence and cite program results more directly.");

  if (budget < 78) notes.push("Budget justification needs a tighter link to program outcomes.");
  else notes.push("Budget narrative supports the requested award level.");

  if (voice >= 86) notes.push("Narrative voice is consistent with nonprofit mission language.");
  else notes.push("Rework tone so it sounds less generic and more organization-specific.");

  scoreEl.textContent = score;
  ringEl.style.setProperty("--score-angle", `${Math.round(score * 3.6)}deg`);
  ratingEl.textContent = score >= 86 ? "Executive-ready candidate" : score >= 74 ? "Strong grant candidate" : "Needs focused revision";
  recommendationEl.textContent =
    score >= 86
      ? "Move into final compliance review, then prepare submission assets."
      : score >= 74
        ? "Prioritize the weakest signal before submission review."
        : "Rebuild alignment, evidence, and budget language before advancing.";
  notesEl.innerHTML = notes.map((note) => `<li>${note}</li>`).join("");
}

sliders.forEach((slider) => slider.addEventListener("input", updateReadiness));
updateReadiness();

const canvas = document.getElementById("legalix-canvas");
const ctx = canvas.getContext("2d");
let tick = 0;

function drawLegalixDemo() {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#122332";
  ctx.fillRect(0, 0, width, height);

  const columns = [
    { x: 70, title: "Inputs", color: "#f5f7f7" },
    { x: 350, title: "AI review", color: "#9ed2ec" },
    { x: 630, title: "Grant package", color: "#c5a15a" }
  ];

  columns.forEach((col, index) => {
    ctx.fillStyle = "rgba(255, 253, 248, 0.08)";
    ctx.strokeStyle = "rgba(255, 253, 248, 0.18)";
    ctx.lineWidth = 1;
    roundRect(ctx, col.x, 54, 210, 292, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = col.color;
    ctx.font = "700 18px system-ui";
    ctx.fillText(col.title, col.x + 22, 92);

    for (let i = 0; i < 5; i += 1) {
      const y = 126 + i * 38;
      const pulse = Math.sin((tick + i * 18 + index * 22) / 28) * 18;
      ctx.fillStyle = i === 2 ? "rgba(197, 161, 90, 0.9)" : "rgba(245, 247, 247, 0.72)";
      roundRect(ctx, col.x + 22, y, 112 + pulse, 12, 6);
      ctx.fill();
    }
  });

  for (let i = 0; i < 2; i += 1) {
    const startX = columns[i].x + 220;
    const endX = columns[i + 1].x - 10;
    const y = 190 + i * 56;
    ctx.strokeStyle = "rgba(158, 210, 236, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.bezierCurveTo(startX + 48, y - 48, endX - 48, y + 48, endX, y);
    ctx.stroke();

    const dot = (tick * 2 + i * 80) % 210;
    ctx.fillStyle = "#9ed2ec";
    ctx.beginPath();
    ctx.arc(startX + dot, y + Math.sin((dot + tick) / 28) * 20, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  tick += 1;
  requestAnimationFrame(drawLegalixDemo);
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

drawLegalixDemo();
