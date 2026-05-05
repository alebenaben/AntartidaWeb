import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact-schema";
import crypto from "crypto";

// Simple in-memory rate limiting map
// In a real multi-instance environment, this should be Redis
const rateLimitMap = new Map<string, number[]>();

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "5", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "600000", 10); // 10 min

function getIpFromRequest(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let requestTimestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps older than the window
  requestTimestamps = requestTimestamps.filter((ts) => ts > windowStart);
  
  if (requestTimestamps.length >= MAX_REQUESTS) {
    // Save filtered timestamps back
    rateLimitMap.set(ip, requestTimestamps);
    return false; // Rate limited
  }

  requestTimestamps.push(now);
  rateLimitMap.set(ip, requestTimestamps);
  return true; // Allowed
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "default-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").substring(0, 16);
}

export async function POST(request: NextRequest) {
  const ip = getIpFromRequest(request);
  const ipHash = hashIp(ip);

  try {
    // 1. Rate Limiting
    if (!checkRateLimit(ip)) {
      console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: "warn", ipHash, status: "rate_limited" }));
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    // 2. Parse Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    // 3. Validate Payload
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: "warn", ipHash, status: "validation_failed" }));
      return NextResponse.json(
        { ok: false, error: "validation", fields: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 4. Check Honeypot
    if (validData._hp) {
      console.info(JSON.stringify({ timestamp: new Date().toISOString(), level: "info", ipHash, status: "honeypot" }));
      // Silently return 200 for bots
      return NextResponse.json({ ok: true });
    }

    // 5. Prepare Payload for Webhook
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", ipHash, status: "missing_webhook_url" }));
      return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
    }

    const serviceLabels: Record<string, string> = {
      "recepcionista-digital": "Recepcionista Digital",
      "qa-agent": "QA Agent",
      "refactoring-agent": "Refactoring Agent",
      "otro": "Otro",
    };

    const webhookPayload = {
      name: validData.name,
      company: validData.company || "",
      email: validData.email,
      phone: validData.phone || "",
      serviceInterest: validData.serviceInterest,
      serviceInterestLabel: serviceLabels[validData.serviceInterest] || validData.serviceInterest,
      message: validData.message,
      acceptsPrivacy: validData.acceptsPrivacy,
      source: "web-antartida-labs",
      submittedAt: new Date().toISOString(),
      meta: {
        userAgent: request.headers.get("user-agent") || "unknown",
        ipHash,
        locale: request.headers.get("accept-language") || "unknown",
      }
    };

    // 6. Send to Webhook
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (process.env.CONTACT_WEBHOOK_SECRET) {
      headers["X-Webhook-Secret"] = process.env.CONTACT_WEBHOOK_SECRET;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(webhookPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", ipHash, status: "webhook_failed", statusCode: response.status }));
      return NextResponse.json({ ok: false, error: "webhook_unavailable" }, { status: 502 });
    }

    // 7. Success
    console.info(JSON.stringify({ timestamp: new Date().toISOString(), level: "info", ipHash, status: "success" }));
    return NextResponse.json({ ok: true });

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", ipHash: hashIp(getIpFromRequest(request)), status: "webhook_timeout" }));
      return NextResponse.json({ ok: false, error: "webhook_unavailable" }, { status: 502 });
    }
    
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", ipHash: hashIp(getIpFromRequest(request)), status: "internal_error" }));
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
