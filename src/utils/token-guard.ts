import * as anchor from "@project-serum/anchor";
import * as TokenGuard from "@civic/token-guard";

import {TransactionInstruction} from "@solana/web3.js";
import {findGatewayToken} from "@identity.com/solana-gateway-ts";

/**
 * If the wallet has a gateway token in the current gatekeeper network, use it to exchange sol with the tokenGuard token.
 * This tokenGuard token will then be passed to the candymachine.
 * @param connection
 * @param anchorWallet
 * @param tokenGuard
 * @param payer
 * @param gatekeeperNetwork
 * @param amount
 */
export const exchange = async (
  connection: anchor.web3.Connection,
  anchorWallet: anchor.Wallet,
  tokenGuard: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  gatekeeperNetwork: anchor.web3.PublicKey,
  amount: number,
): Promise<TransactionInstruction[]> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: "recent",
  });

  const gatewayToken = await findGatewayToken(connection, anchorWallet.publicKey, gatekeeperNetwork);
  
  if (!gatewayToken) throw new Error("Wallet has no gateway token");
  
  const program = await TokenGuard.fetchProgram(provider)

  return TokenGuard.exchange(
    connection,
    program,
    tokenGuard,
    payer,
    payer,
    gatekeeperNetwork,
    amount
  )
}
