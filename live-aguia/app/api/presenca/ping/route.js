export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, segundos } = body;

    if (!sessionId || typeof segundos !== "number") {
      return Response.json(
        { error: "sessionId e segundos são obrigatórios" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(
        `${supabaseUrl}/rest/v1/presenca_live?session_id=eq.${encodeURIComponent(
          sessionId
        )}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            segundos_assistidos: Math.round(segundos),
            atualizado_em: new Date().toISOString(),
          }),
        }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Erro interno", detalhe: error.message },
      { status: 500 }
    );
  }
}
