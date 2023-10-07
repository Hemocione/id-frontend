import "../styles/globals.css";
import Head from "next/head";
// import { Navbar } from "../components";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";
import { ptBR as datePickerPtBR } from "@mui/x-date-pickers/locales";
import { ptBR as dataGridPtBR } from "@mui/x-data-grid";

const theme = createTheme({}, ptBR, datePickerPtBR, dataGridPtBR);

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
        {/* block user zoom on mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        ></meta>
        {/* add meta tag for cadastro in SEO */}
        <meta
          name="description"
          content="Hemocione é uma plataforma de doação de sangue"
        />
        <meta
          name="keywords"
          content="doação de sangue, hemocione, hemocentro, doação, sangue, sangue doação, doar sangue, doar"
        />
        <meta name="author" content="Hemocione" />
        <meta name="language" content="pt-br" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="1 day" />
        <meta name="generator" content="Hemocione" />
        <meta name="theme-color" content="#FF0000" />
        <meta name="msapplication-TileColor" content="#FF0000" />
        <meta name="msapplication-navbutton-color" content="#FF0000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#FF0000" />
      </Head>
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100vw",
          }}
        >
          {/* <Navbar /> */}
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
