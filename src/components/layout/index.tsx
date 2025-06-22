import { Outlet } from "react-router";

import { Header } from "../header";

export const Layout = () => {
  return (
    <>
      <Header /> {/*renderiza o componente header fixo*/}
      <Outlet /> {/*renderiza o resto baseado na rota*/}
    </>
  );
};
