import Head from 'next/head'

import { useState } from "react";
import { Toaster } from 'react-hot-toast';
import { useWallet } from "@solana/wallet-adapter-react";
import useCandyMachine from '../hooks/use-candy-machine';
import Header from '../components/header';
import Footer from '../components/footer';
import useWalletBalance from '../hooks/use-wallet-balance';
import { shortenAddress } from '../utils/candy-machine';
import Countdown from 'react-countdown';
import { RecaptchaButton } from '../components/recaptcha-button';
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useGatekeeperNetwork} from "../hooks/use-gateway";
import {IdentityButton, useGateway} from "@civic/solana-gateway-react";
import {IconLogo} from "../components/IconLogo";
import useTokenGuard from "../hooks/use-token-guard";
import {Button} from "@solana/wallet-adapter-react-ui/lib/Button";

const Home = () => {
  const [balance] = useWalletBalance()
  const [isActive, setIsActive] = useState(false);
  const { gatekeeperNetwork } = useGatekeeperNetwork()
  const { gatewayToken } = useGateway()
  const wallet = useWallet();
  const tokenGuard = useTokenGuard();
  const { isSoldOut, mintStartDate, isMinting, onMint, nftsData } = useCandyMachine()
  
  const walletPermissioned = !!gatewayToken;
  
  console.log("tokenGuard", tokenGuard)
  
  const mint = () => onMint(tokenGuard);
  
  return (
    <main className="p-5">
      <Toaster />
      <Head>
        <title>Solana Candy Factory</title>
        <meta name="description" content="Solana blockchain candy machine app boilerplate on top of Metaplex Candy Machine. NextJS, Tailwind, Anchor, SolanaLabs.React, dev/mainnet automation scripts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex flex-col justify-center items-center flex-1 space-y-3 mt-20">
        <div style={{height: '300px'}}>
          <IconLogo width="250" height="250"/>
          <p style={{
            position: 'relative',
            top: '-100px',
            fontSize: '6rem',
            textAlign: 'end'
          }}>🍭</p>
        </div>
        { gatekeeperNetwork && <IdentityButton/>}

        {!wallet.connected && <span
          className="text-gray-800 font-bold text-2xl cursor-default">
          NOT CONNECTED, PLEASE CLICK SELECT WALLET...
        </span>}

        {wallet.connected &&
          <div className="inline-flex" title={walletPermissioned ? 'Wallet is permitted to mint' : 'Wallet is not permitted to mint'}>
            {/*{ gatewayToken ? gatewayToken.publicKey.toBase58() : "NO GT"}*/}
            { walletPermissioned !== undefined && ( 
              walletPermissioned ? 
              <FontAwesomeIcon icon={faCheckCircle} className="w-4" color="green" /> : 
              <FontAwesomeIcon icon={faTimesCircle} className="w-4" color="red" />
            )}
            <p className="text-gray-800 font-bold text-lg cursor-default">Address: {shortenAddress(wallet.publicKey?.toBase58() || "")}</p>
          </div>
        }

        {wallet.connected &&
          <>
            <p className="text-gray-800 font-bold text-lg cursor-default">Balance: {(balance || 0).toLocaleString()} SOL (devnet)</p>
            <p className="text-gray-800 font-bold text-lg cursor-default">Available/Minted/Total: {nftsData.itemsRemaining}/{nftsData.itemsRedeemed}/{nftsData.itemsAvailable}</p>
          </>
        }

        <div className="flex flex-col justify-start items-start">
          {wallet.connected &&
            <Button
              disabled={isSoldOut || isMinting || !isActive || !walletPermissioned}
              onClick={mint}
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ?
                <span>MINT {isMinting && 'LOADING...'}</span> :
                <Countdown
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              }
            </Button>
          }
        </div>
        <Footer />
      </div>
    </main>
  );
};

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <span className="text-gray-800 font-bold text-2xl cursor-default">
      Live in {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
    </span>
  );
};

export default Home;



