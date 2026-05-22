"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const indicador = params.indicador;

    localStorage.setItem("indicador", indicador);

    const utms = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ];

    utms.forEach((utm) => {
      const valor = searchParams.get(utm);
      if (valor) {
        localStorage.setItem(utm, valor);
      }
    });

    window.location.href = "/";
  }, [params.indicador, searchParams]);

  return <h1>Redirecionando...</h1>;
}