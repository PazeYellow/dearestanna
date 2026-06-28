const WORKER_URL = "https://dearestanna.theyellowlightsader.workers.dev/";

const form = document.querySelector("#entry-form");
const entryInput = document.querySelector("#entry");
const responseBox = document.querySelector("#response");

let glitchTimer;
let checking = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function glitchElement(element) {
  element.classList.remove("glitch");
  void element.offsetWidth;
  element.classList.add("glitch");
}

function setResponse(message) {
  responseBox.textContent = message;
  glitchElement(responseBox);
}

function setInputState(state) {
  entryInput.classList.remove("waiting", "success", "error");

  if (state) {
    entryInput.classList.add(state);
  }

  glitchElement(entryInput);
}

function startWrongDelay() {
  clearInterval(glitchTimer);
  entryInput.readOnly = true;
  setInputState("waiting");

  glitchTimer = setInterval(() => {
    glitchElement(entryInput);
    document.body.classList.toggle("chroma-shift");
  }, 230);
}

function stopWrongDelay() {
  clearInterval(glitchTimer);
  glitchTimer = null;
  entryInput.readOnly = false;
  document.body.classList.remove("chroma-shift");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (checking) {
    return;
  }

  const password = entryInput.value.trim();

  if (!password) {
    setInputState("error");
    return;
  }

  checking = true;
  startWrongDelay();
  setResponse("");

  try {
    await sleep(900 + Math.random() * 900);

    const reply = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    await sleep(600 + Math.random() * 1000);

    const data = await reply.json();
    stopWrongDelay();

    if (!reply.ok || !data.ok) {
      entryInput.value = password;
      setInputState("error");
      document.body.classList.remove("bad");
      void document.body.offsetWidth;
      document.body.classList.add("bad");
      return;
    }

    entryInput.value = data.message || "";
    setInputState("success");
  } catch (error) {
    stopWrongDelay();
    entryInput.value = password;
    setInputState("error");
    document.body.classList.remove("bad");
    void document.body.offsetWidth;
    document.body.classList.add("bad");
  } finally {
    stopWrongDelay();
    checking = false;
    entryInput.focus();
  }
});

entryInput.addEventListener("input", () => {
  document.body.classList.remove("bad");
  entryInput.classList.remove("success", "error");
});
