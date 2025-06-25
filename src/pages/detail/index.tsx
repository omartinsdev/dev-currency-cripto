import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { API_KEY } from "../home";
import { type CoinProps } from "../home";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export const Detail = () => {
  const [coin, setCoin] = useState<CoinProps>();

  const { cripto } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getCripto = async () => {
      try {
        const API_URL = `https://rest.coincap.io/v3/assets/${cripto}?apiKey=${API_KEY}`;

        const response = await fetch(API_URL);
        const data: DataProps = await response.json();

        if ("error" in data) return navigate("/");

        const currencyFormatter = (
          currency: number,
          locale: string = "en-US"
        ) => {
          return new Intl.NumberFormat(locale, {
            currency: "USD",
            style: "currency",
          }).format(currency);
        };

        const compactCurrencyFormatter = (
          currency: number,
          locale: string = "en-US"
        ) => {
          return new Intl.NumberFormat(locale, {
            currency: "USD",
            style: "currency",
            notation: "compact",
          }).format(currency);
        };

        const resultData = {
          ...data.data,
          formattedPrice: currencyFormatter(Number(data.data.priceUsd)),
          formattedMarket: compactCurrencyFormatter(
            Number(data.data.marketCapUsd)
          ),
          formattedVolume: compactCurrencyFormatter(
            Number(data.data.volumeUsd24Hr)
          ),
        };

        setCoin(resultData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(`Erro desconhecido: ${err}`);
        }

        navigate("/");
      }
    };

    getCripto();
  }, [cripto]);

  return (
    <div>
      <h1>Página detalhe da {cripto}</h1>
    </div>
  );
};
