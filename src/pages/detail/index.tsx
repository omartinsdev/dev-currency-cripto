import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { API_KEY } from "../home";
import { type CoinProps } from "../home";

import styles from "./detail.module.css";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export const Detail = () => {
  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(false);
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

  if (loading || !coin)
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando...</h4>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          alt="Logo da moeda"
          className={styles.logo}
        />

        <h1>
          {coin?.name} | {coin?.symbol}
        </h1>

        <p>
          <strong>Preço: </strong>
          {coin?.formattedPrice}
        </p>

        <a>
          <strong>Mercado: </strong>
          {coin?.formattedMarket}
        </a>

        <a>
          <strong>Volume: </strong>
          {coin?.formattedVolume}
        </a>

        <a>
          <strong>Mudança 24H: </strong>
          <span
            className={
              Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(3)}
          </span>
        </a>
      </section>
    </div>
  );
};
