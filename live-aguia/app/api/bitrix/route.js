export async function POST(request) {
  try {
    const body = await request.json();

    const { nome, telefone, email, indicador } = body;

    const webhook = process.env.BITRIX_WEBHOOK_URL;

    if (!nome || !telefone) {
      return Response.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Criar contato
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
              VALUE: telefone,
              VALUE_TYPE: "WORK",
            },
          ],
          EMAIL: email
            ? [
                {
                  VALUE: email,
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

    // 2. Criar negócio/card no pipeline 36
const negocioResponse = await fetch(`${webhook}/crm.item.add`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    entityTypeId: 2,
    fields: {
      title: `Lead Live - ${nome}`,
      contactId: contatoId,
      categoryId: 36,
      stageId: "C36:NEW",

      // responsável do card
      assignedById: Number(indicador),

      comments: `Lead cadastrado pela LP da live. ID do indicador/responsável: ${
        indicador || "Sem indicador"
      }`,
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

    return Response.json({
      success: true,
      contatoId,
      negocio: negocioData.result,
      indicador,
    });
  } catch (error) {
    return Response.json(
      { error: "Erro interno", detalhe: error.message },
      { status: 500 }
    );
  }
}