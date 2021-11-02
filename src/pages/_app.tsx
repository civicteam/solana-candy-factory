import '../styles/globals.css'
import { useMemo } from "react";
import { WalletAdapterNetwork } from "@identity.com/wallet-adapter-base";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

let WALLETS: any = {
  getCryptidWallet: () => ({ name: 'Cryptid' }),
  getPhantomWallet: () => ({ name: 'Phantom' }),
  getSolflareWallet: () => ({ name: 'Solflare' }),
  getSolletWallet: () => ({ name: 'Sollet' }),
  getLedgerWallet: () => ({ name: 'Ledger' }),
  getSlopeWallet: () => ({ name: 'Slope' }),
  getSolletExtensionWallet: () => ({ name: 'SolletExtension' })
};
if (typeof window !== "undefined") {
  WALLETS = require("@identity.com/wallet-adapter-wallets");
}

import {
  ConnectionProvider,
  WalletProvider,
} from "@identity.com/wallet-adapter-react";
import "@identity.com/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@identity.com/wallet-adapter-react-ui";
import { WalletBalanceProvider } from '../hooks/use-wallet-balance';

const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;

const App = ({ Component, pageProps }: any) => {
  const endpoint = useMemo(() => 'https://solana-api.projectserum.com', []);

  const wallets = useMemo(
    () => [
      WALLETS.getCryptidWallet(),
      WALLETS.getPhantomWallet(),
      WALLETS.getSolflareWallet(),
      WALLETS.getSolletWallet({ network }),
      WALLETS.getLedgerWallet(),
      WALLETS.getSlopeWallet(),
      WALLETS.getSolletExtensionWallet({ network }),
    ],
    []
  );

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletBalanceProvider>
              <Component  {...pageProps} />
            </WalletBalanceProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </GoogleReCaptchaProvider>

  );
};


export default App