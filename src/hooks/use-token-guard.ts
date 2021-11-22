import {useCallback, useEffect, useState} from "react";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {getTokenGuardState, TokenGuardState} from "@civic/token-guard";
import {exchange} from "../utils/token-guard";
import {findGatewayToken, GatewayToken} from "@identity.com/solana-gateway-ts";

const tokenGuardId = new anchor.web3.PublicKey(
  process.env.NEXT_PUBLIC_TOKEN_GUARD!
);

const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

// exposes the token guard state and a function to generate tokenGuard exchange instructions
// requires a TOKEN_GUARD environment variable to be set, containing the ID of the token guard
// generated using `token-guard create`
export default function useTokenGuard() {
  const [tokenGuardState, setTokenGuardState] = useState<TokenGuardState>();
  const [gatewayToken, setGatewayToken] = useState<GatewayToken>();
  const wallet = useWallet();

  // load the tokenGuard state in order to obtain the gatekeeperNetwork
  // this runs on startup (i.e. before a wallet is connected)
  useEffect(() => {
      getTokenGuardState(
        tokenGuardId,
        connection
      ).then(setTokenGuardState);
  }, [tokenGuardId, connection, setTokenGuardState]);

  // load a user's gateway token 
  // this runs once a wallet is connected
  useEffect(() => {
    (async () => {
      if (!tokenGuardState?.gatekeeperNetwork || !wallet || !wallet.publicKey) return;
      const foundToken = await findGatewayToken(connection, wallet.publicKey, tokenGuardState.gatekeeperNetwork);
      setGatewayToken(foundToken ? foundToken : undefined)
    })();
  }, [tokenGuardState, setGatewayToken, wallet, wallet?.publicKey])

  const tokenGuardExchange = useCallback((amount: number) => {
    if (!tokenGuardId || !tokenGuardState || !wallet || !wallet.publicKey) return null;

    const anchorWallet = {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
    
    return exchange(
      connection,
      anchorWallet,
      tokenGuardId,
      wallet.publicKey,
      tokenGuardState.gatekeeperNetwork,
      amount
    );
  }, [tokenGuardId, wallet, wallet.publicKey, tokenGuardState])

  return { tokenGuardState, tokenGuardExchange, gatewayToken }
}