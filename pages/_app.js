import "../styles/globals.css";
import Head from "next/head";
import { Navbar } from "../components";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Hemocione</title>
      </Head>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100vw",
        }}
      >
        <Navbar />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
