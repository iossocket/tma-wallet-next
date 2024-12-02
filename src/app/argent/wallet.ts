import { ArgentTMA, SessionAccountInterface } from "@argent/tma-wallet";
import { Call, Contract } from "starknet";
const APP_NAME = "";
const T_URL = "";
const TAMAGOTCHI_ADDRESS = "0x4ff1e7fff5c512112ad442e485ca599c02f23946e568b8504711142055b7f9b";

export const initWallet = (contractAddress: string) =>
  ArgentTMA.init({
    environment: 'sepolia',
    appName: APP_NAME,
    appTelegramUrl: T_URL,
    sessionParams: {
      allowedMethods: [
        { contract: contractAddress, selector: 'feed' },
        { contract: contractAddress, selector: 'play' },
        { contract: contractAddress, selector: 'rest' },
        { contract: contractAddress, selector: 'set_stats_to_half' },
      ],
      validityDays: 90,
    },
  });

export const argentTMA = initWallet(TAMAGOTCHI_ADDRESS);

export async function executeContractAction(
  contract: Contract,
  account: SessionAccountInterface,
  argentTMA: ArgentTMA,
  action: string,
  successMessage: string,
  errorMessage: string
) {
  const call: Call = {
    contractAddress: contract.address,
    entrypoint: action,
    calldata: [],
  };

  try {
    const fees = await account?.estimateInvokeFee([call]);
    const tx = await contract[action]({
      maxFee: fees?.suggestedMaxFee ? BigInt(fees.suggestedMaxFee) * 2n : undefined,
    });
    await argentTMA.provider.waitForTransaction(tx.transaction_hash);
    console.log(successMessage);
    return true;
  } catch (error) {
    console.error(`Error performing ${action}:`, error);
    console.error(errorMessage);
    return false;
  }
}