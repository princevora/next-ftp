import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Layout } from "@/components";
import UseGlobalContext from "@/context/all-context-provider";
import NextTopLoader from "nextjs-toploader";
// import RenameItemContextProvider from "@/components/context/renameItem/RenameItemContext";
// import { CollapseContextProivder } from "@/components/context/ftperrors-collapse/errors-collapse-context";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Online Ftp Solution",
    template: "%s | Next-FTP"
  },
  description:
    "Connect to your ftp server without downloading any softwares",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/dialog.js" async></script>
      </head>
      <body className={roboto.className}>
        <NextTopLoader speed={500} />
        <UseGlobalContext>
          <Layout>
            {children}
          </Layout>
        </UseGlobalContext>
      </body>
    </html >
  );
}
