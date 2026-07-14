export default function Footer() {
  return (
    <footer className="px-6 py-14 text-center text-white">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7">
        <p>
          A Águia Consultoria Imobiliária, inscrita no CNPJ
          14.865.476/0001-08, é registrada sob o CRECI 3535-J.
        </p>

        <p>
          Seu endereço de e-mail será utilizado exclusivamente para
          o envio de oportunidades, conteúdos sobre investimentos e
          comunicações da Águia Consultoria Imobiliária. Para mais
          informações, acesse nossa{" "}
          <a
            href="https://aguiaconsultoriaimobiliaria.com/politica-de-privacidade/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#f89921]"
          >
            Política de Privacidade
          </a>
          .
          <br />
          <br />
          As rentabilidades passadas não garantem resultados
          futuros. Recomendamos a análise completa de todas as
          condições antes de realizar qualquer investimento.
        </p>

        <p>
          A Águia Consultoria Imobiliária valoriza a precisão das
          informações divulgadas e assegura a verificação de todo o
          conteúdo por sua equipe.
        </p>

        <p>© Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}