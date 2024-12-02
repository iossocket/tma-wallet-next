/**
 * This file is autogenerated by Scaffold-Stark.
 * You should not edit it manually or your changes might be overwritten.
 */

const deployedContracts = {
  sepolia: {
    Tamagotchi: {
      address:
        "0x4ff1e7fff5c512112ad442e485ca599c02f23946e568b8504711142055b7f9b",
      abi: [
        {
          type: "impl",
          name: "TamagotchiImpl",
          interface_name: "contracts::Tamagotchi::ITamagotchi",
        },
        {
          type: "interface",
          name: "contracts::Tamagotchi::ITamagotchi",
          items: [
            {
              type: "function",
              name: "get_hunger",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u8",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "get_happiness",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u8",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "get_energy",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u8",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "feed",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "play",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "rest",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "set_stats_to_half",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
          ],
        },
        {
          type: "constructor",
          name: "constructor",
          inputs: [],
        },
        {
          type: "event",
          name: "contracts::Tamagotchi::Tamagotchi::Event",
          kind: "enum",
          variants: [],
        },
      ],
      classHash:
        "0x585912efddba64aa694ddf20a4683f8753cf7f912f0d2f14765f7c3372a8c96",
    },
  },
} as const;

export default deployedContracts;
