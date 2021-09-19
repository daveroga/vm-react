// opcode.ADD -> 10

const _opcodeList = [
  { code: 0, name: "HALT", nargs: 0 },
  { code: 1, name: "PUSH", nargs: 1 },
  { code: 2, name: "POP", nargs: 0 },
  { code: 3, name: "DUP", nargs: 0 },
  { code: 4, name: "DUP2", nargs: 0 },
  { code: 5, name: "SWAP", nargs: 0 },

  { code: 8, name: "INC", nargs: 0 },
  { code: 9, name: "DEC", nargs: 0 },

  { code: 10, name: "ADD", nargs: 0 },
  { code: 11, name: "SUB", nargs: 0 },
  { code: 12, name: "MUL", nargs: 0 },
  { code: 13, name: "DIV", nargs: 0 },
  { code: 14, name: "MOD", nargs: 0 },

  { code: 20, name: "LT", nargs: 0 },
  { code: 21, name: "LE", nargs: 0 },
  { code: 22, name: "GT", nargs: 0 },
  { code: 23, name: "GE", nargs: 0 },
  { code: 24, name: "EQ", nargs: 0 },
  { code: 25, name: "NEQ", nargs: 0 },

  { code: 30, name: "BR", nargs: 1 },
  { code: 31, name: "BRT", nargs: 1 },
  { code: 32, name: "BRF", nargs: 1 },

  { code: 40, name: "LOAD", nargs: 0 },
  { code: 41, name: "STORE", nargs: 0 },  
  
  { code: 100, name: "PR", nargs: 0 }
];

export const opcode = {};
export const opcodeInfo = new Array(256);

_opcodeList.forEach( op => {
  opcode[op.name] = op.code;
  opcodeInfo[op.code] = op;
});

