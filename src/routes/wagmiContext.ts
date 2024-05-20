import {
    type NoSerialize,
    createContextId,
  } from "@builder.io/qwik";
  import {  type Config } from "@wagmi/core";

  
  export interface WagmiConfig {
    config: NoSerialize<Config>;
  }
  
  export const WagmiConfigContext = createContextId<WagmiConfig>(
    "wagmi-config-context",
  );
  

  