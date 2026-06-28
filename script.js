const WORKER_URL = "https://dearestanna.theyellowlightsader.workers.dev/";

const form = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password");
const responseBox = document.querySelector("#response");

function setResponse(message, state = "") {
  responseBox.textContent = message;
  responseBox.className = `response ${state}`.trim();
  responseBox.classList.remove("glitch");
  void responseBox.offsetWidth;
  responseBox.classList.add("glitch");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = passwordInput.value.trim();

  if (!password) {
    setResponse("", "error");
    return;
  }

  passwordInput.disabled = true;
  setResponse("");

  try {
    const reply = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await reply.json();

    if (!reply.ok || !data.ok) {
      setResponse(data.message || "", "error");
      return;
    }

    setResponse(data.message || "", "success");
  } catch (error) {
    setResponse("", "error");
  } finally {
    passwordInput.disabled = false;
    passwordInput.focus();
  }
});
