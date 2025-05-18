import { Abi } from "viem";

export const buyArtistTokenActionAbi: Abi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "configure",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address"
      },
      {
        name: "params",
        type: "tuple[]",
        internalType: "struct KeyValue[]",
        components: [
          {
            name: "key",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "value",
            type: "bytes",
            internalType: "bytes"
          }
        ]
      }
    ],
    outputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address"
      },
      {
        name: "params",
        type: "tuple[]",
        internalType: "struct KeyValue[]",
        components: [
          {
            name: "key",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "value",
            type: "bytes",
            internalType: "bytes"
          }
        ]
      }
    ],
    outputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setDisabled",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address"
      },
      {
        name: "isDisabled",
        type: "bool",
        internalType: "bool"
      },
      {
        name: "params",
        type: "tuple[]",
        internalType: "struct KeyValue[]",
        components: [
          {
            name: "key",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "value",
            type: "bytes",
            internalType: "bytes"
          }
        ]
      }
    ],
    outputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceID",
        type: "bytes4",
        internalType: "bytes4"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "ACTION_HUB",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  }
] as const satisfies Abi; 