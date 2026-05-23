export async function onRequestGet(context) {
  const supabaseUrl = String(context.env.SUPABASE_URL || "").replace(
    /\/+$/,
    "",
  );
  const supabaseAnonKey = String(context.env.SUPABASE_ANON_KEY || "");

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(
      {
        error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY.",
      },
      500,
    );
  }

  const query = new URLSearchParams({
    select: "id,title,slug,content,created_at,excerpt",
    order: "created_at.desc",
    limit: "50",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/posts?${query}`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Accept: "application/json",
    },
  });

  const payload = await response.text();

  if (!response.ok) {
    return jsonResponse(
      {
        error: "Supabase request failed.",
        details: payload,
      },
      response.status,
    );
  }

  return new Response(payload, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "public, max-age=60",
    },
  });
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}
