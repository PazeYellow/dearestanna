function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function loadResponses(env) {
  if (env.ARG_RESPONSES) {
    return JSON.parse(env.ARG_RESPONSES);
  }

  if (env.ARG_PASSWORD && env.ARG_ANSWER) {
    return {
      [env.ARG_PASSWORD]: env.ARG_ANSWER,
    };
  }

  return {};
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return json({});
    }

    if (request.method !== "POST") {
      return json({ ok: false, message: "not found" }, 404);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({ ok: false, message: "bad request" }, 400);
    }

    let responses;

    try {
      responses = loadResponses(env);
    } catch {
      return json({ ok: false, message: "worker secret is invalid" }, 500);
    }

    const password = String(body.password || "").trim();
    const answer = responses[password];

    if (!answer) {
      return json({ ok: false, message: "" }, 401);
    }

    return json({ ok: true, message: String(answer) });
  },
};
