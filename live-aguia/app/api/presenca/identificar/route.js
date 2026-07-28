import { campanha } from "@/config/campanha";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, telefone, sessionId } = body;

    if (!sessionId) {
      return Response.json(
        { error: "sessionId é obrigatório" },
        { status: 400 }
      );
    }

    const emailLimpo = email ? String(email).trim().toLowerCase() : "";
    const telefoneLimpo = telefone ? String(telefone).replace(/\D/g, "") : "";

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const webhook = process.env.BITRIX_WEBHOOK_URL;

    let identificado = false;
    let leadNome = null;
    let leadTelefone = null;
    let leadEmail = null;
    let bitrixDealId = null;

    if (supabaseUrl && supabaseKey && (emailLimpo || telefoneLimpo)) {
      const filtros = [];

      if (emailLimpo) {
        filtros.push(`email.eq.${emailLimpo}`);
      }

      if (telefoneLimpo) {
        filtros.push(`telefone.eq.${telefoneLimpo}`);
      }

      const consulta = await fetch(
        `${supabaseUrl}/rest/v1/flash_sales_leads?select=nome,telefone,email,bitrix_deal_id&evento=eq.${encodeURIComponent(
          campanha.codigo
        )}&or=(${filtros.join(",")})&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      const resultado = await consulta.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        identificado = true;
        leadNome = resultado[0].nome;
        leadTelefone = resultado[0].telefone;
        leadEmail = resultado[0].email;
        bitrixDealId = resultado[0].bitrix_deal_id;
      }
    }

    // Marca "Assistiu a Live? = Sim" no card do Bitrix desse lead
    if (webhook && bitrixDealId) {
      await fetch(`${webhook}/crm.item.update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityTypeId: 2,
          id: Number(bitrixDealId),
          fields: {
            ufCrm_1785268495073: 24444,
          },
        }),
      });
    }

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/presenca_live`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          evento: campanha.codigo,
          session_id: sessionId,
          identificado,
          lead_nome: leadNome,
          lead_telefone: leadTelefone,
          lead_email: leadEmail,
          entrada_email: emailLimpo || null,
        }),
      });
    }

    return Response.json({ success: true, identificado, nome: leadNome });
  } catch (error) {
    return Response.json(
      { error: "Erro interno", detalhe: error.message },
      { status: 500 }
    );
  }
}
