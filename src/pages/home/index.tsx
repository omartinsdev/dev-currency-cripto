import { useRef, type FormEvent, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router";

import styles from "./home.module.css";

export const API_KEY: string =
  "c6e25b2278116798084e722ebdfef322397722e0647cc7c6f60002d0e99881ee";

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formattedPrice?: string;
  formattedMarket?: string;
  formattedVolume?: string;
}

interface ResponseData {
  data: CoinProps[];
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export const Home = () => {
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const API_URL: string = `https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=${API_KEY}`;

        const response = await fetch(API_URL);
        const data: DataProps = await response.json();

        if ("error" in data) {
          return;
        }

        const coinsData = data.data;

        const formatCurrency = (currency: number, compact = false) => {
          if (!compact) {
            return new Intl.NumberFormat("en-US", {
              currency: "USD",
              style: "currency",
            }).format(currency);
          } else if (compact) {
            return new Intl.NumberFormat("en-US", {
              currency: "USD",
              style: "currency",
              notation: "compact",
            }).format(currency);
          }
        };

        const formattedCoinsData = coinsData.map((coin) => {
          const { priceUsd, marketCapUsd, volumeUsd24Hr } = coin;

          const formattedCoins = {
            ...coin,
            formattedPrice: formatCurrency(+priceUsd),
            formattedMarket: formatCurrency(+marketCapUsd, true),
            formattedVolume: formatCurrency(+volumeUsd24Hr, true),
          };

          return formattedCoins;
        });

        const finalData = [...coins, ...formattedCoinsData];

        setCoins(finalData);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(`Erro inexperado: ${err}`);
        }

        return;
      }
    };

    getData();
  }, [offset]);

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();

    const searchedCoin = inputRef.current?.value?.toLowerCase();

    if (searchedCoin === "") {
      navigate("/");
      return;
    }

    navigate(`/detail/${searchedCoin}`);
  };

  const handleGetMoreCriptos = () => {
    if (offset === 0) {
      setOffset(10);
      return;
    }

    setOffset((offset) => offset + 10);
  };

  if (loading) {
    return (
      <div>
        <h4 className={styles.center}>Carregando...</h4>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmitForm}>
        <input placeholder="Pesquise por uma criptomoeda" ref={inputRef} />

        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24H</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((coin) => (
              <tr className={styles.tableRow} key={coin.id}>
                <td className={styles.tdLabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.criptoLogo}
                      alt="Logo criptomoeda"
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                    />

                    <Link to={`/detail/${coin.id}`}>
                      <span>{coin.symbol}</span>
                    </Link>
                  </div>
                </td>

                <td className={styles.tdLabel} data-label="Valor mercado">
                  {coin.formattedMarket}
                </td>

                <td className={styles.tdLabel} data-label="Preço">
                  {coin.formattedPrice}
                </td>

                <td className={styles.tdLabel} data-label="Volume">
                  {coin.formattedVolume}
                </td>

                <td
                  className={
                    Number(coin.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-label="Mudança 24H"
                >
                  <span>{Number(coin.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.seeMoreBtn} onClick={handleGetMoreCriptos}>
        Carregar mais
      </button>
    </main>
  );
};
