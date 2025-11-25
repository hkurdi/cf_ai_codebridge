import { ConversationDO } from "./conversation";
import type { Env } from "./types";

export { ConversationDO };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleCors();
    }

    if (url.pathname.startsWith("/api/session/")) {
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (pathParts.length < 3) {
        return jsonResponse(
          {
            success: false,
            error: "Invalid path. Use /api/session/{sessionId}/{endpoint}",
          },
          400
        );
      }

      const sessionId = pathParts[2];
      const endpoint = "/" + pathParts.slice(3).join("/");

      const id = env.CONVERSATIONS.idFromName(sessionId);
      const stub = env.CONVERSATIONS.get(id);

      const newUrl = new URL(request.url);
      newUrl.pathname = endpoint;

      const modifiedRequest = new Request(newUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      return stub.fetch(modifiedRequest);
    }

    if (url.pathname === "/health") {
      return jsonResponse({
        success: true,
        response: "CodeBridge API is running",
      });
    }

    return jsonResponse(
      {
        success: false,
        error:
          "Not found. Use /api/session/{sessionId}/translate or /api/session/{sessionId}/message",
      },
      404
    );
  },
};

function handleCors(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
