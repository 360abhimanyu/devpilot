const form = document.getElementById("askForm");
const promptBox = document.getElementById("prompt");
const submitBtn = document.getElementById("submitBtn");
const resultSection = document.getElementById("resultSection");
const answerEl = document.getElementById("answer");
const resultMeta = document.getElementById("resultMeta");
const selectedModeEl = document.getElementById("selectedMode");
const modeNames = {explain:"Explain code",debug:"Debug an error",review:"Review code",document:"Generate docs",git:"Git assistant",linux:"Linux assistant",learn:"Learn a concept"};
let mode = "explain";
let lastAnswer = "";

function setMode(next) {
  mode = next;
  selectedModeEl.textContent = "✦ " + modeNames[mode];
  document.querySelectorAll("[data-mode]").forEach(el => el.classList.toggle("selected", el.dataset.mode === mode));
}
document.querySelectorAll("[data-mode]").forEach(el => el.addEventListener("click", () => setMode(el.dataset.mode)));
document.getElementById("newChat").addEventListener("click", () => {
  promptBox.value = ""; resultSection.hidden = true; promptBox.focus();
});
function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
}
function renderMarkdown(text) {
  // Small safe renderer: escape HTML first, then support common Markdown patterns.
  let s = escapeHtml(text);
  s = s.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/^## (.*)$/gm, "<h2>$1</h2>");
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/^\- (.*)$/gm, "<li>$1</li>");
  s = s.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
  return s.split(/\n{2,}/).map(block => block.startsWith("<h") || block.startsWith("<pre") || block.startsWith("<ul") ? block : `<p>${block.replace(/\n/g,"<br>")}</p>`).join("");
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = promptBox.value.trim();
  if (!prompt) return;
  submitBtn.disabled = true; submitBtn.querySelector("span").textContent = "Thinking…";
  resultSection.hidden = false; resultMeta.textContent = "Generating a response…";
  answerEl.textContent = "Please wait while DevPilot works on your request.";
  try {
    const res = await fetch("/api/ask", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt,mode})});
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Request failed");
    lastAnswer = data.answer;
    answerEl.innerHTML = renderMarkdown(data.answer);
    resultMeta.textContent = `Mode: ${modeNames[mode]}  ·  Provider: ${data.provider}  ·  Model: ${data.model}`;
    resultSection.scrollIntoView({behavior:"smooth",block:"start"});
  } catch (err) {
    answerEl.textContent = `Could not get a response: ${err.message}`;
    resultMeta.textContent = "Request error";
  } finally {
    submitBtn.disabled = false; submitBtn.querySelector("span").textContent = "Ask DevPilot";
  }
});
document.getElementById("copyBtn").addEventListener("click", async () => {
  if (!lastAnswer) return;
  await navigator.clipboard.writeText(lastAnswer);
  document.getElementById("copyBtn").textContent = "Copied!";
  setTimeout(() => document.getElementById("copyBtn").textContent = "Copy answer", 1500);
});
