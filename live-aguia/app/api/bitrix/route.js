import { campanha } from "@/config/campanha";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
  nome,
  telefone,
  email,
  indicador,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
} = body;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "IP não identificado";

    const userAgent =
      request.headers.get("user-agent") || "User agent não identificado";

    const origem = request.headers.get("referer") || "Origem não identificada";

    const dataHora = new Date().toLocaleString("pt-BR");

    const webhook = process.env.BITRIX_WEBHOOK_URL;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!nome || !telefone) {
      return Response.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    const telefoneLimpo = String(telefone).replace(/\D/g, "");
    const emailLimpo = email ? String(email).trim().toLowerCase() : "";

    // 0. Verificar se o lead já é cliente de um corretor ativo na Águia
    let corretorAtivo = null;

    if (supabaseUrl && supabaseKey && (telefoneLimpo || emailLimpo)) {
      const filtrosVenda = [];

      if (telefoneLimpo) {
        filtrosVenda.push(`telefone.eq.${telefoneLimpo}`);
      }

      if (emailLimpo) {
        filtrosVenda.push(`email.eq.${emailLimpo}`);
      }

      const consultaVenda = await fetch(
        `${supabaseUrl}/rest/v1/vendas_corretores?select=corretor_ativo&corretor_ativo=not.is.null&or=(${filtrosVenda.join(
          ","
        )})&limit=1`,
        {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      const vendasEncontradas = await consultaVenda.json();

      if (Array.isArray(vendasEncontradas) && vendasEncontradas.length > 0) {
        corretorAtivo = vendasEncontradas[0].corretor_ativo;
      }
    }

    // 1. Consultar duplicado no Supabase
    let leadOriginal = null;

    if (supabaseUrl && supabaseKey) {
      const filtros = [];

      if (telefoneLimpo) {
        filtros.push(`telefone.eq.${telefoneLimpo}`);
      }

      if (emailLimpo) {
        filtros.push(`email.eq.${emailLimpo}`);
      }

      if (filtros.length > 0) {
        const consultaDuplicado = await fetch(
        `${supabaseUrl}/rest/v1/flash_sales_leads?evento=eq.${encodeURIComponent(
          campanha.codigo
            )}&or=(${filtros.join(",")})&order=created_at.asc&limit=1`,
          {
            method: "GET",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        const duplicados = await consultaDuplicado.json();

        if (Array.isArray(duplicados) && duplicados.length > 0) {
          leadOriginal = duplicados[0];
        }
      }
    }

    const duplicado = Boolean(leadOriginal);

    // Caso especial: o cadastro original (nesta mesma campanha) veio de um
    // dos funis genéricos de marketing e agora um corretor de verdade está
    // reivindicando esse mesmo lead. O card antigo vai para "duplicado" e
    // o novo card (deste corretor) vai direto para "validado".
    const reassumidoPorCorretor =
      duplicado &&
      campanha.indicadoresMarketing.includes(String(leadOriginal?.indicador)) &&
      !campanha.indicadoresMarketing.includes(String(indicador));

    let stageId = campanha.etapaInicial;

    if (corretorAtivo) {
      stageId = campanha.etapaCorretorAtivo;
    } else if (reassumidoPorCorretor) {
      stageId = campanha.etapaValidado;
    }

    // 2. Criar contato no Bitrix
    const contatoResponse = await fetch(`${webhook}/crm.contact.add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          NAME: nome,
          PHONE: [
            {
              VALUE: telefoneLimpo,
              VALUE_TYPE: "WORK",
            },
          ],
          EMAIL: emailLimpo
            ? [
                {
                  VALUE: emailLimpo,
                  VALUE_TYPE: "WORK",
                },
              ]
            : [],
            
        },
      }),
    });

    const contatoData = await contatoResponse.json();

    if (!contatoData.result) {
      return Response.json(
        { error: "Erro ao criar contato", detalhe: contatoData },
        { status: 500 }
      );
    }

    const contatoId = contatoData.result;

    const comentarioDuplicado = duplicado
      ? `
⚠️ LEAD DUPLICADO NA CAMPANHA

Este telefone/e-mail já apareceu antes na base limpa da campanha.

Indicador original: ${leadOriginal?.indicador || "Não identificado"}
Indicador desta tentativa: ${indicador || "Sem indicador"}
Primeiro cadastro em: ${
  leadOriginal?.created_at
    ? new Date(leadOriginal.created_at).toLocaleString("pt-BR")
    : "Não identificado"
}
ID original no Supabase: ${leadOriginal?.id || "Não identificado"}
`
      : `
Lead novo na campanha.
`;

    // 3. Criar negócio/card no Bitrix
    const negocioResponse = await fetch(`${webhook}/crm.item.add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entityTypeId: 2,
        fields: {
    title: duplicado && !reassumidoPorCorretor
      ? `[DUPLICADO] ${campanha.nome} - ${nome}`
      : `${campanha.nome} - ${nome}`,

  contactId: contatoId,
  categoryId: campanha.pipeline,
  stageId: stageId,

  assignedById: Number(indicador),

  utmSource: utm_source || "",
  utmMedium: utm_medium || "",
  utmCampaign: utm_campaign || "",
  utmContent: utm_content || "",
  utmTerm: utm_term || "",

  ufCrm_1774964189: duplicado ? 23156 : null,
  ufCrm_1778773957526: corretorAtivo || null,

  comments: `
${comentarioDuplicado}

Lead cadastrado pela Landing Page da campanha.

Campanha: ${campanha.nome}

Duplicado: ${duplicado ? "SIM" : "NÃO"}

Corretor ativo identificado: ${corretorAtivo || "Não"}
${
  reassumidoPorCorretor
    ? `\n🔁 LEAD REIVINDICADO POR CORRETOR\n\nEsse lead tinha entrado antes pelo marketing (indicador ${leadOriginal?.indicador}) nesta campanha. O card antigo (negócio #${leadOriginal?.bitrix_deal_id || "desconhecido"}) foi movido para a etapa Duplicado.\n`
    : ""
}
Nome: ${nome}
Telefone: ${telefoneLimpo}
E-mail: ${emailLimpo || "Não informado"}

ID do indicador/responsável: ${indicador || "Sem indicador"}

IP: ${ip}

Dispositivo/Navegador:
${userAgent}

Origem:
${origem}

Parâmetros UTM:
utm_source: ${utm_source || "Não informado"}
utm_medium: ${utm_medium || "Não informado"}
utm_campaign: ${utm_campaign || "Não informado"}
utm_content: ${utm_content || "Não informado"}
utm_term: ${utm_term || "Não informado"}

Data/Hora:
${dataHora}
`,
        },
      }),
    });

    const negocioData = await negocioResponse.json();

    if (!negocioData.result) {
      return Response.json(
        { error: "Erro ao criar negócio", detalhe: negocioData },
        { status: 500 }
      );
    }

    const negocioId =
      negocioData.result?.item?.id || negocioData.result?.id || null;

    // 3.1 Se esse lead foi reivindicado por um corretor, move o card antigo
    // (que estava com o marketing) para a etapa de Duplicado.
    if (reassumidoPorCorretor && leadOriginal?.bitrix_deal_id) {
      await fetch(`${webhook}/crm.item.update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityTypeId: 2,
          id: Number(leadOriginal.bitrix_deal_id),
          fields: {
            stageId: campanha.etapaDuplicado,
          },
        }),
      });
    }

    // 4. Salvar lead no Supabase
    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/flash_sales_leads`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nome,
          telefone: telefoneLimpo,
          email: emailLimpo,
          evento: campanha.codigo,
          indicador: indicador ? String(indicador) : null,
          origem,
          ip,
          user_agent: userAgent,
          duplicado,
          lead_original_id: leadOriginal?.id || null,
          indicador_original: leadOriginal?.indicador || null,
          bitrix_deal_id: negocioId ? String(negocioId) : null,
          utm_source: utm_source || null,
utm_medium: utm_medium || null,
utm_campaign: utm_campaign || null,
utm_content: utm_content || null,
utm_term: utm_term || null,
        }),
      });
    }

    return Response.json({
      success: true,
      contatoId,
      negocio: negocioData.result,
      indicador,
      duplicado,
      leadOriginal,
      corretorAtivo,
      reassumidoPorCorretor,
      stageId,
      campanha: campanha.codigo,
    });
  } catch (error) {
    return Response.json(
      { error: "Erro interno", detalhe: error.message },
      { status: 500 }
    );
  }
}