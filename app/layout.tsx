import "styles/globals.css";
import { AppProvider } from "components/AppContextFolder/AppContext";

export const metadata = {
  title: "Artem Polovyi - Software Engineer",
  description:
    "I've been working as a full-stack engineer for 6 years straight. Get in touch with me to know more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
