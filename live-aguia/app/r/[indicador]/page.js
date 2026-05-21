"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();

  useEffect(() => {
    const indicador = params.indicador;

    console.log("Indicador:", indicador);

    localStorage.setItem("indicador", indicador);

    window.location.href = "/";
  }, [params.indicador]);

  return <h1>Redirecionando...</h1>;
}