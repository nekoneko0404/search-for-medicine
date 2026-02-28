var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-WxcrgB/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/normalizer.ts
var CodeNormalizer = class {
  /**
   * 全角英数字を半角に変換します。
   */
  static toHalfWidth(str) {
    return str.replace(/[！-～]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/　/g, " ");
  }
  /**
   * 入力されたコードを解析し、正規化された形式に変換します。
   */
  static normalize(code) {
    if (!code)
      return "";
    let cleanCode = this.toHalfWidth(code).trim();
    const parts = cleanCode.split(/[:：\-\s\.\(\)（）|｜【】\[\]]/).filter((p) => p.length > 0);
    for (const part of parts) {
      const alphanumericPart = part.replace(/[^0-9A-Z]/gi, "").toUpperCase();
      if (alphanumericPart.length === 12) {
        if (!/^(CODE|RESE|YJCODE|ITEMID)$/.test(alphanumericPart)) {
          return alphanumericPart;
        }
      }
      if (alphanumericPart.length === 9) {
        if (/^[0-9]{9}$/.test(alphanumericPart)) {
          return alphanumericPart;
        }
      }
    }
    let alphanumericOnly = cleanCode.replace(/[^0-9A-Z]/gi, "").toUpperCase();
    alphanumericOnly = alphanumericOnly.replace(/^(CODE|YJ|NO|ID|RESE|ITEM|REF)+/, "");
    if (alphanumericOnly.length >= 12) {
      const yjMatch = alphanumericOnly.match(/[0-9]{1,9}[0-9A-Z]{3,11}/);
      if (yjMatch && yjMatch[0].length === 12)
        return yjMatch[0];
      return alphanumericOnly.slice(0, 12);
    }
    if (alphanumericOnly.length >= 9) {
      const numMatch = alphanumericOnly.match(/[0-9]{9}/);
      if (numMatch)
        return numMatch[0];
      return alphanumericOnly.slice(0, 9);
    }
    return alphanumericOnly;
  }
  /**
   * CSV 等から抽出された複数のコードを一括で正規化します。
   */
  static batchNormalize(codes) {
    return codes.map((c) => this.normalize(c)).filter((c) => c !== "");
  }
};
__name(CodeNormalizer, "CodeNormalizer");

// src/line.ts
var LineClient = class {
  accessToken;
  constructor(accessToken) {
    this.accessToken = accessToken;
  }
  /**
   * LINE のプッシュメッセージを送信する
   * @param to ユーザーID (LINE)
   * @param messages 送信するメッセージの配列
   */
  async pushMessage(to, messages) {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({
        to,
        messages
      })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("LINE Push Error:", error);
      throw new Error(`LINE API failed: ${error}`);
    }
    return await response.json();
  }
};
__name(LineClient, "LineClient");

// src/notify.ts
var LineNotifier = class {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }
  async send(endpoint, payload) {
    const client = new LineClient(this.accessToken);
    const text = `\u3010\u4F9B\u7D66\u72B6\u6CC1\u30A2\u30E9\u30FC\u30C8\u3011
${payload.title}

` + payload.items.map((i) => `\u30FB\u30B3\u30FC\u30C9: ${i.yj_code}
  ${i.old_status || "\u4E0D\u660E"} \u2192 ${i.new_status}`).join("\n\n");
    await client.pushMessage(endpoint, [{ type: "text", text }]);
  }
};
__name(LineNotifier, "LineNotifier");
var WebhookNotifier = class {
  async send(endpoint, payload) {
    const text = `*\u3010\u4F9B\u7D66\u72B6\u6CC1\u30A2\u30E9\u30FC\u30C8\u3011*
${payload.title}

` + payload.items.map((i) => `\u2022 \u30B3\u30FC\u30C9: \`${i.yj_code}\`
  ${i.old_status || "\u4E0D\u660E"} \u2192 *${i.new_status}*`).join("\n\n");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        // Slack
        content: text
        // Discord
      })
    });
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${await response.text()}`);
    }
  }
};
__name(WebhookNotifier, "WebhookNotifier");
var EmailNotifier = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async send(endpoint, payload) {
    const html = `
            <h3>\u3010\u4F9B\u7D66\u72B6\u6CC1\u30A2\u30E9\u30FC\u30C8\u3011</h3>
            <p>${payload.title}</p>
            <ul>
                ${payload.items.map((i) => `
                    <li>
                        <strong>\u30B3\u30FC\u30C9: ${i.yj_code}</strong><br>
                        ${i.old_status || "\u4E0D\u660E"} &rarr; <span style="color: red;">${i.new_status}</span>
                    </li>
                `).join("")}
            </ul>
        `;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Medicine Alert <alerts@medicine-scanner.pages.dev>",
        to: [endpoint],
        subject: `\u4F9B\u7D66\u72B6\u6CC1\u30A2\u30E9\u30FC\u30C8: ${payload.items.length}\u4EF6\u306E\u5909\u5316`,
        html
      })
    });
    if (!response.ok) {
      throw new Error(`Email failed: ${response.status} ${await response.text()}`);
    }
  }
};
__name(EmailNotifier, "EmailNotifier");
var NotificationFactory = class {
  static getNotifier(channel, env) {
    switch (channel) {
      case "line":
        return new LineNotifier(env.LINE_ACCESS_TOKEN || "");
      case "webhook":
        return new WebhookNotifier();
      case "email":
        return new EmailNotifier(env.RESEND_API_KEY || "");
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }
};
__name(NotificationFactory, "NotificationFactory");

// src/index.ts
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/stores/register" && request.method === "POST") {
      try {
        const { id, name, passcode, planType } = await request.json();
        await env.DB.prepare(
          "INSERT INTO stores (id, name, passcode, plan_type) VALUES (?, ?, ?, ?)"
        ).bind(id, name, passcode, planType || "free").run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response("Conflict or Error", { status: 409 });
      }
    }
    if (url.pathname === "/api/watch-items/batch" && request.method === "POST") {
      try {
        const {
          storeId,
          passcode,
          yjCodes,
          notifyFilter,
          notifyLineEndpoints,
          notifyEmailEndpoints,
          notifyWebhookEndpoints
        } = await request.json();
        const store = await env.DB.prepare(
          "SELECT plan_type, passcode FROM stores WHERE id = ?"
        ).bind(storeId).first();
        if (!store || store.passcode !== passcode) {
          return new Response("Unauthorized", { status: 401 });
        }
        const limit = store.plan_type === "standard" ? 3e3 : 20;
        if (yjCodes.length > limit) {
          return new Response(`Limit exceeded. ${store.plan_type} plan limit is ${limit}.`, { status: 403 });
        }
        const normalizedCodes = CodeNormalizer.batchNormalize(yjCodes);
        const uniqueCodes = Array.from(new Set(normalizedCodes)).slice(0, limit);
        const statements = [];
        if (notifyFilter) {
          statements.push(
            env.DB.prepare("UPDATE stores SET notify_filter = ? WHERE id = ?").bind(notifyFilter, storeId)
          );
        }
        if (notifyLineEndpoints !== void 0) {
          statements.push(
            env.DB.prepare("UPDATE stores SET notify_line_endpoints = ? WHERE id = ?").bind(notifyLineEndpoints, storeId)
          );
        }
        if (notifyEmailEndpoints !== void 0) {
          statements.push(
            env.DB.prepare("UPDATE stores SET notify_email_endpoints = ? WHERE id = ?").bind(notifyEmailEndpoints, storeId)
          );
        }
        if (notifyWebhookEndpoints !== void 0) {
          statements.push(
            env.DB.prepare("UPDATE stores SET notify_webhook_endpoints = ? WHERE id = ?").bind(notifyWebhookEndpoints, storeId)
          );
        }
        statements.push(env.DB.prepare("DELETE FROM watch_items WHERE store_id = ?").bind(storeId));
        for (const code of uniqueCodes) {
          statements.push(
            env.DB.prepare("INSERT INTO watch_items (store_id, yj_code) VALUES (?, ?)").bind(storeId, code)
          );
        }
        await env.DB.batch(statements);
        return new Response(JSON.stringify({ success: true, count: uniqueCodes.length }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("Batch update error:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    if (url.pathname === "/api/notifications/test" && request.method === "POST") {
      try {
        const { storeId, passcode, channel, target } = await request.json();
        const store = await env.DB.prepare(
          "SELECT passcode, name FROM stores WHERE id = ?"
        ).bind(storeId).first();
        if (!store || store.passcode !== passcode) {
          return new Response("Unauthorized", { status: 401 });
        }
        const notifier = NotificationFactory.getNotifier(channel, env);
        await notifier.send(target, {
          title: `\u3010\u30C6\u30B9\u30C8\u9001\u4FE1\u3011${store.name}\u69D8\u3001\u8A2D\u5B9A\u306E\u78BA\u8A8D\u3067\u3059\u3002`,
          message: "\u3053\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u304C\u8868\u793A\u3055\u308C\u3066\u3044\u308C\u3070\u3001\u901A\u77E5\u8A2D\u5B9A\u306F\u6B63\u5E38\u3067\u3059\u3002",
          items: [
            { yj_code: "TEST-CODE", old_status: "\u4E0D\u660E", new_status: "\u6B63\u5E38\u52D5\u4F5C\u4E2D" }
          ]
        });
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response("Not Found", { status: 404 });
  },
  async scheduled(event, env, ctx) {
    console.log("Cron Running: Updating market status and sending notifications...");
    try {
      await updateMarketStatusSnapshot(env);
      console.log("Market status snapshot updated successfully.");
    } catch (err) {
      console.error("Failed to update market status snapshot:", err);
    }
    const changes = await env.DB.prepare(`
            SELECT 
                s.id as store_id,
                s.name as store_name,
                s.notify_filter,
                s.notify_line_endpoints,
                s.notify_email_endpoints,
                s.notify_webhook_endpoints,
                w.yj_code, 
                m.status as new_status,
                w.last_notified_status as old_status
            FROM watch_items w
            JOIN stores s ON w.store_id = s.id
            JOIN market_status_snapshots m ON w.yj_code = m.yj_code
            WHERE m.status != COALESCE(w.last_notified_status, '')
        `).all();
    if (changes.results.length === 0) {
      console.log("No status changes detected.");
      return;
    }
    const notificationsByStore = {};
    for (const row of changes.results) {
      if (!notificationsByStore[row.store_id]) {
        notificationsByStore[row.store_id] = [];
      }
      notificationsByStore[row.store_id].push(row);
    }
    for (const [storeId, items] of Object.entries(notificationsByStore)) {
      const firstItem = items[0];
      const filter = firstItem.notify_filter;
      const filteredItems = filter === "restored_only" ? items.filter((i) => i.new_status === "\u901A\u5E38") : items;
      if (filteredItems.length === 0)
        continue;
      const payload = {
        title: `${firstItem.store_name}\u69D8\u3001\u4EE5\u4E0B\u306E\u63A1\u7528\u85AC\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u304C\u5909\u5316\u3057\u307E\u3057\u305F\uFF1A`,
        message: "",
        items: filteredItems.map((i) => ({
          yj_code: i.yj_code,
          old_status: i.old_status,
          new_status: i.new_status
        }))
      };
      const channels = [
        { type: "line", data: firstItem.notify_line_endpoints, limit: 3 },
        { type: "email", data: firstItem.notify_email_endpoints, limit: 3 },
        { type: "webhook", data: firstItem.notify_webhook_endpoints, limit: 0 }
      ];
      for (const ch of channels) {
        if (!ch.data)
          continue;
        const endpoints = ch.data.split(",").map((e) => e.trim()).filter((e) => e.length > 0);
        const targets = ch.limit > 0 ? endpoints.slice(0, ch.limit) : endpoints;
        for (const target of targets) {
          try {
            const notifier = NotificationFactory.getNotifier(ch.type, env);
            await notifier.send(target, payload);
          } catch (err) {
            console.error(`Failed to notify store ${storeId} via ${ch.type} at ${target}:`, err?.message || err);
          }
        }
      }
      for (const item of items) {
        await env.DB.prepare(
          "UPDATE watch_items SET last_notified_status = ? WHERE store_id = ? AND yj_code = ?"
        ).bind(item.new_status, storeId, item.yj_code).run();
      }
    }
  }
};
async function updateMarketStatusSnapshot(env) {
  const FILE_ID_MAIN = "1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU";
  const columns = "E,L";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${FILE_ID_MAIN}/gviz/tq?tqx=out:csv&t=${Date.now()}&tq=${encodeURIComponent("SELECT " + columns)}`;
  const response = await fetch(csvUrl);
  if (!response.ok)
    throw new Error(`Fetch failed: ${response.status}`);
  const csvText = await response.text();
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(csvText));
  const currentHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const lastHash = await env.DB.prepare("SELECT value FROM system_config WHERE key = 'last_csv_hash'").first();
  if (lastHash && lastHash.value === currentHash) {
    console.log("CSV has not changed. Skipping DB update.");
    return;
  }
  const rows = csvText.trim().split("\n").slice(1);
  const statements = [];
  for (const rowText of rows) {
    const row = parseCSVLine(rowText);
    if (row.length < 2)
      continue;
    const yjCode = row[0].replace(/"/g, "").trim();
    const status = row[1].replace(/"/g, "").trim();
    if (yjCode && status) {
      statements.push(
        env.DB.prepare(
          "INSERT INTO market_status_snapshots (yj_code, status, last_updated) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(yj_code) DO UPDATE SET status = EXCLUDED.status, last_updated = CURRENT_TIMESTAMP"
        ).bind(yjCode, status)
      );
    }
  }
  const chunkSize = 100;
  for (let i = 0; i < statements.length; i += chunkSize) {
    await env.DB.batch(statements.slice(i, i + chunkSize));
  }
  await env.DB.prepare(
    "INSERT INTO system_config (key, value, updated_at) VALUES ('last_csv_hash', ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP"
  ).bind(currentHash).run();
}
__name(updateMarketStatusSnapshot, "updateMarketStatusSnapshot");
function parseCSVLine(text) {
  const result = [];
  let current = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuote && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (char === "," && !inQuote) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
__name(parseCSVLine, "parseCSVLine");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// .wrangler/tmp/bundle-WxcrgB/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-WxcrgB/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
