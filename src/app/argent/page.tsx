"use client";
import { Page } from "@/components/Page";
import deployedContracts from "./deployedContracts";
import { useEffect, useState } from "react";
import { argentTMA, executeContractAction } from "./wallet";
import { SessionAccountInterface } from "@argent/tma-wallet";
import { AccountInterface, Contract } from "starknet";

const ABI = deployedContracts.sepolia.Tamagotchi.abi;
const TAMAGOTCHI_ADDRESS = "0x4ff1e7fff5c512112ad442e485ca599c02f23946e568b8504711142055b7f9b";

export default function ArgentPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<SessionAccountInterface | undefined>();
  const [contract, setContract] = useState<Contract | undefined>();
  const [hunger, setHunger] = useState(0);
  const [happiness, setHappiness] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const updateStats = async () => {
    if (!contract) return;
    try {
      const [hunger, happiness, energy] = await Promise.all([
        contract.get_hunger(),
        contract.get_happiness(),
        contract.get_energy(),
      ]);

      setHunger(Number(hunger));
      setHappiness(Number(happiness));
      setEnergy(Number(energy));
    } catch (e) {
      console.error("update states error:", e);
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const res = await argentTMA.connect();
        if (!res) {
          setIsConnected(false);
          return;
        }
        setAccount(res.account);
        if (account?.getSessionStatus() !== "VALID") {
          setIsConnected(false);
          return;
        }
        setContract(new Contract(ABI, TAMAGOTCHI_ADDRESS, account as unknown as AccountInterface));
        setIsConnected(true);
        await updateStats();
      } catch (e) {
        console.error("init error:", e);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (action: string) => {
    if (!contract || !isConnected || !account) return;
    try {
      setIsLoading(true);

      const messages = {
        feed: { success: 'Pet has been fed! 🍖', error: 'Failed to feed pet 😕' },
        play: { success: 'You played with your Pet! 🎮', error: 'Failed to play with pet 😕' },
        rest: { success: 'Pet is sleeping! 🛌', error: 'Pet is not sleeping 😕' },
        set_stats_to_half: {
          success: 'Stats have been reset! 🔄',
          error: 'Failed to reset stats 😕',
        },
      };

      const result = await executeContractAction(
        contract,
        account,
        argentTMA,
        action,
        messages[action as keyof typeof messages].success,
        messages[action as keyof typeof messages].error
      );

      if (result) await updateStats();
    } catch (e) {
      console.error("action error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleConnect = async () => {
    try {
      await argentTMA.requestConnection('tamagochi_connection');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  const handleDisconnect = async () => {
    try {
      await argentTMA.clearSession();
      setAccount(undefined);
      setIsConnected(false);
      setContract(undefined);
      setHunger(100);
      setHappiness(100);
      setEnergy(100);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }

  return <Page>
    <>
      {
        isConnected ?
          <div>
            <button onClick={async () => handleDisconnect()}>
              {account?.address}
            </button>
            <div>
              <div>Hunger: {hunger}</div>
              <div>Happiness: {happiness}</div>
              <div>Energy: {energy}</div>
            </div>
            <div>
              <button onClick={async () => handleAction('feed')}>
                Feed
              </button>
              <button onClick={async () => handleAction('play')}>
                Play
              </button>
              <button onClick={async () => handleAction('rest')}>
                Reset
              </button>
              <button onClick={async () => handleAction('set_stats_to_half')}>
                ResetStats
              </button>
              <div>{isLoading}</div>
            </div>
          </div> :
          <button onClick={async () => handleConnect()}>
            Connect wallet
          </button>
      }
    </>
  </Page>
}