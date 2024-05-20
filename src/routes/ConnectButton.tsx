import {
  component$,
  $,
  useContext,
  type QRL,
  NoSerialize,
} from "@builder.io/qwik";
import { reconnect } from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi";
import { Config } from "wagmi";
import { WagmiConfigContext } from "./wagmiContext";

export interface WalletConnectProps {
  afterConnect: QRL<() => void>;
}
const openWeb3Modal = async (config: NoSerialize<Config>) => {
  const projectId = import.meta.env.PUBLIC_PROJECT_ID;
  if (!projectId || typeof projectId !== "string") {
    throw new Error("Missing project ID");
  }
  if (config) await reconnect(config!);
  const modal = createWeb3Modal({
    wagmiConfig: config!,
    projectId,
  });

  await modal.open({ view: "Connect" });

  return modal;
};

export default component$((props) => {
  const wagmiConfig = useContext(WagmiConfigContext);

  const openModal = $(async () => {
    await openWeb3Modal(wagmiConfig!.config);
  });

  return <button onClick$={openModal}>connect </button>;
});
