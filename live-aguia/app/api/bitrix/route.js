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

    // 0.1 Se o lead veio pelo link genérico de Comunidades (366), verificar
    // se ele já tinha se inscrito numa live anterior através de um corretor
    // específico — se achar, o responsável do card passa a ser esse corretor
    // ao invés de ficar no genérico 366 (só muda o responsável, o resto do
    // rastreio continua normalmente como Comunidades).
    let indicadorEfetivo = indicador;

    // Redirecionamento direto configurado (indicador X sempre cria no nome
    // do indicador Y) — tem prioridade sobre a busca na planilha da live
    // anterior, que só vale pro indicador 366.
    if (campanha.redirecionamentoResponsavel[String(indicador)]) {
      indicadorEfetivo = campanha.redirecionamentoResponsavel[String(indicador)];
    } else if (
      String(indicador) === "366" &&
      supabaseUrl &&
      supabaseKey &&
      (telefoneLimpo || emailLimpo)
    ) {
      const filtrosAnterior = [];

      if (telefoneLimpo) {
        filtrosAnterior.push(`telefone.eq.${telefoneLimpo}`);
      }

      if (emailLimpo) {
        filtrosAnterior.push(`email.eq.${emailLimpo}`);
      }

      const consultaAnterior = await fetch(
        `${supabaseUrl}/rest/v1/inscritos_evento_anterior?select=responsavel_id&or=(${filtrosAnterior.join(
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

      const encontradosAnterior = await consultaAnterior.json();

      if (Array.isArray(encontradosAnterior) && encontradosAnterior.length > 0) {
        indicadorEfetivo = encontradosAnterior[0].responsavel_id;
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

    const origemRastreio = reassumidoPorCorretor
      ? "Lead cedido pelo Marketing"
      : campanha.origensRastreio[String(indicador)] || null;

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

  assignedById: Number(indicadorEfetivo),

  utmSource: utm_source || "",
  utmMedium: utm_medium || "",
  utmCampaign: utm_campaign || "",
  utmContent: utm_content || "",
  utmTerm: utm_term || "",

  ufCrm_1774964189: duplicado && !reassumidoPorCorretor ? 23156 : null,
  ufCrm_1778773957526: corretorAtivo || null,
  ufCrm_1773284588156: corretorAtivo ? 23056 : null,
  ufCrm_68DD340519D3E: origemRastreio,

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

    // 3.1 Se esse lead foi reivindicado por um corretor, desqualifica o card
    // antigo (que estava com o marketing): move pra etapa de Duplicado e
    // acrescenta uma nota no histórico (timeline) explicando o motivo.
    //
    // Importante: a observação vai como nota no timeline (crm.timeline.comment.add),
    // NÃO sobrescrevendo o campo "comments" do card — esse pipeline tem uma
    // automação própria que regenera o campo "comments" logo depois de
    // qualquer alteração, então uma nota ali seria perdida silenciosamente.
    if (reassumidoPorCorretor && leadOriginal?.bitrix_deal_id) {
      const dealIdAntigo = Number(leadOriginal.bitrix_deal_id);

      await fetch(`${webhook}/crm.item.update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityTypeId: 2,
          id: dealIdAntigo,
          fields: {
            stageId: campanha.etapaDuplicado,
          },
        }),
      });

      await fetch(`${webhook}/crm.timeline.comment.add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            ENTITY_ID: dealIdAntigo,
            ENTITY_TYPE: "deal",
            COMMENT: `LEAD DESQUALIFICADO: esse lead veio originalmente pelo marketing e foi reivindicado pelo corretor ${
              indicador || "desconhecido"
            } (negócio #${negocioId || "desconhecido"}) em ${dataHora}. Esse card foi desqualificado.`,
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