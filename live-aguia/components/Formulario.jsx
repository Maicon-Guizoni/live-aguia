export default function Formulario({
  enviarFormulario,
  enviando,
  erroTelefone,
  status,
}) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-7 text-black shadow-2xl">
      <h2 className="text-2xl font-light leading-tight md:text-3xl">
        Não perca essa oportunidade e garanta sua vaga para essa
        <br />
        LIVE EXCLUSIVA!
      </h2>

      <p className="mt-4 text-zinc-500">
        Preencha seus dados para confirmar sua participação.
      </p>

      <form
        onSubmit={enviarFormulario}
        className="mt-8 flex flex-col gap-4"
      >
        <input
          name="nome"
          required
          className="rounded border border-zinc-300 bg-zinc-100 px-4 py-4 outline-none"
          placeholder="Nome"
        />

        <input
          name="email"
          type="email"
          required
          className="rounded border border-zinc-300 bg-zinc-100 px-4 py-4 outline-none"
          placeholder="Email"
        />

        <input
          name="telefone"
          required
          maxLength={15}
          className="rounded border border-zinc-300 bg-zinc-100 px-4 py-4 outline-none"
          placeholder="Telefone"
        />

        {erroTelefone && (
          <p className="text-sm text-red-500">{erroTelefone}</p>
        )}

        <button
          disabled={enviando}
          className="rounded bg-[#f89921] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#f58319] disabled:opacity-60"
        >
          {enviando
            ? "Confirmando inscrição..."
            : "GARANTIR MINHA VAGA"}
        </button>
      </form>

      {status && (
        <p className="mt-4 text-sm text-green-600">{status}</p>
      )}
    </div>
  );
}