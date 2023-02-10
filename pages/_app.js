import "../styles/globals.css";
import Head from "next/head";
import { Navbar } from "../components";
import { Lato } from "@next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <style jsx global>{`
          html {
            font-family: ${lato.style.fontFamily};
          }
        `}</style>
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
