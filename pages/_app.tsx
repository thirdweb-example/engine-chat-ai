import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet, en } from "@thirdweb-dev/react";
import {ArbitrumSepolia} from "@thirdweb-dev/chains";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
    activeChain={ArbitrumSepolia}
    clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    locale={en()}
    supportedWallets={[
      embeddedWallet({
        auth: {
          options: [
            "email",
            "google",
            "apple",
            "facebook",
          ],
        },
      }),
    ]}
  >  <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
