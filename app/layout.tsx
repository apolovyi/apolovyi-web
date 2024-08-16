import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from "next/font/google";
import { AppProvider } from "@/components/shared/AppContext";
import "styles/globals.css";
import Script from "next/script";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={`${comfortaa.variable} ${quicksand.variable} ${ibmPlexMono.variable} ${merriweather.variable}`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
        <Script src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe" strategy="afterInteractive" defer />
      </body>
    </html>
  );
};

export default RootLayout;
