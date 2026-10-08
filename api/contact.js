export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { service, problem, name, email, phone } = req.body || {};
    if (!name || !email || !problem) {
      return res.status(400).json({ error: "Name, email and problem are required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Email service is not configured" });

    const html = "<h2>New SNA AI enquiry</h2>" +
      "<p><strong>Service:</strong> " + escapeHtml(service || "Not specified") + "</p>" +
      "<p><strong>Problem:</strong><br>" + escapeHtml(problem).replace(/\n/g, "<br>") + "</p>" +
      "<hr>" +
      "<p><strong>Name:</strong> " + escapeHtml(name) + "</p>" +
      "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>" +
      "<p><strong>Phone / WhatsApp:</strong> " + escapeHtml(phone || "Not provided") + "</p>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "SNA AI Website <onboarding@resend.dev>",
        to: ["snaomkproject@gmail.com"],
        reply_to: email,
        subject: "New SNA AI enquiry from " + name,
        html
      })
    });

    if (!response.ok) {
      console.error(await response.text());
      return res.status(502).json({ error: "Email provider rejected the message" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to send enquiry" });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
