async function sendExpoPush({ expoTokens, title, body, data }) {
  if (!expoTokens || expoTokens.length === 0) {
    return { ok: true, provider: "expo", sent: 0 };
  }

  const messages = expoTokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messages),
  });

  if (!res.ok) {
    throw new Error(`Expo push failed with [${res.status}] ${res.statusText}`);
  }

  const json = await res.json().catch(() => ({}));
  return { ok: true, provider: "expo", sent: expoTokens.length, result: json };
}

async function sendFcmPush({ fcmTokens, title, body, data }) {
  if (!fcmTokens || fcmTokens.length === 0) {
    return { ok: true, provider: "fcm", sent: 0 };
  }

  const serverKey = process.env.FCM_SERVER_KEY;
  if (!serverKey) {
    throw new Error(
      "Missing process.env.FCM_SERVER_KEY. Add it in Project Settings → Secrets.",
    );
  }

  // Legacy FCM endpoint (simple, works with server key)
  const payload = {
    registration_ids: fcmTokens,
    notification: {
      title,
      body,
      sound: "default",
    },
    data: data || {},
  };

  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${serverKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `FCM push failed with [${res.status}] ${res.statusText} ${text}`,
    );
  }

  const json = await res.json().catch(() => ({}));
  return { ok: true, provider: "fcm", sent: fcmTokens.length, result: json };
}

/**
 * Send a push notification to a mixed set of tokens.
 *
 * Supports:
 * - Expo push tokens (token_type = 'expo')
 * - Firebase Cloud Messaging tokens (token_type = 'fcm')
 */
export async function sendPushToTokens({ tokens, title, body, data }) {
  const expoTokens = [];
  const fcmTokens = [];

  for (const t of tokens || []) {
    if (!t?.token) {
      continue;
    }
    if (t.token_type === "fcm") {
      fcmTokens.push(t.token);
    } else {
      expoTokens.push(t.token);
    }
  }

  const results = [];

  // Expo is optional but makes dev/testing work even without full FCM config.
  try {
    results.push(await sendExpoPush({ expoTokens, title, body, data }));
  } catch (error) {
    console.error("Expo push error:", error);
    results.push({ ok: false, provider: "expo", error: error.message });
  }

  try {
    results.push(await sendFcmPush({ fcmTokens, title, body, data }));
  } catch (error) {
    console.error("FCM push error:", error);
    results.push({ ok: false, provider: "fcm", error: error.message });
  }

  return { ok: true, results };
}
