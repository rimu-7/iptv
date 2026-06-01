"use server";

interface TurnstileResponse {
  success: boolean;
  "error-codes": string[];
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey || !token) {
    console.error("Missing secret key or token");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      },
    );

    const data: TurnstileResponse = await response.json();

    if (!data.success) {
      console.error("Verification failed:", data["error-codes"]);
    }

    return data.success;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}
