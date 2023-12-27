import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {
  ThirdwebProvider,
  embeddedWallet,
  en,
} from "@thirdweb-dev/react";
import {ArbitrumSepolia} from "@thirdweb-dev/chains";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Fantastic Quest',
  description: 'Text adventure game where LLM mints NFTs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    >
      </ThirdwebProvider>
  )
}
