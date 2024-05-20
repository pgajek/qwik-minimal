import {
  component$,
  noSerialize,
  Slot,
  useContext,
  useContextProvider,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { defaultWagmiConfig } from "@web3modal/wagmi";
import { mainnet } from "viem/chains";
import { Config, reconnect, watchAccount } from "@wagmi/core";
import { WagmiConfigContext } from "./wagmiContext";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const metadata = {
    name: "Web3Modal",
    description: "Web3Modal Example",
    url: "https://web3modal.com", // origin must match your domain & subdomain.
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  useContextProvider(WagmiConfigContext, {
    config: noSerialize(
      defaultWagmiConfig({
        chains: [mainnet],
        projectId: import.meta.env.PUBLIC_PROJECT_ID,
        metadata,
      })
    ),
  });

  const wagmiConfig = useContext(WagmiConfigContext);

  useVisibleTask$(() => {
    console.log("[Config z contextu]: ", wagmiConfig.config);

    console.log(
      "[config wywołany w logu]: ",
      noSerialize(
        defaultWagmiConfig({
          chains: [mainnet],
          projectId: import.meta.env.PUBLIC_PROJECT_ID,
          metadata,
        })
      )
    );
    const wconfig = defaultWagmiConfig({
      chains: [mainnet],
      projectId: import.meta.env.PUBLIC_PROJECT_ID,
      metadata,
    });

    wagmiConfig.config = noSerialize(wconfig);

    console.log("[config z contextu po przypisaniu]: ", wagmiConfig.config);
    if (wagmiConfig.config) {
      watchAccount(wagmiConfig.config!, {
        onChange(account) {
          reconnect(wagmiConfig.config as Config);
        },
      });
    }
  });
  return <Slot />;
});
