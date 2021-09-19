
import { opcode } from './opcodes.js';
import VirtualMachine from './vm.js';

const vm = new VirtualMachine();

/*
  push 1
inicio:
  dup
  push 100
  gt
  brt fin
  dup
  inc
  br inicio
fin:
  halt
*/

const bucle10000 = [  
  opcode.PUSH, 1, 
  opcode.DUP, // 2
  opcode.PUSH, 10000,
  opcode.GT,
  opcode.BRT, 13,
  opcode.DUP,
  opcode.PR,
  opcode.INC,
  opcode.BR, 2,
  opcode.HALT, //13    
];

const esprimo = [
  opcode.PUSH, 2,     // N 2
/* inicio */ 
  opcode.DUP2,        // N 2 N 2
  opcode.DUP,         // N 2 N 2 2
  opcode.MUL,         // N 2 N 4
  opcode.LT,          // N 2
  opcode.BRT, 22, /*primo*/
  opcode.DUP2,        // N 2 N 2
  opcode.MOD,         // N 2 X
  opcode.PUSH, 0,     // N 2 X 0
  opcode.EQ,
  opcode.BRT, 18, /* no primo */
  opcode.INC,         // N 3
  opcode.BR, 2, /* inicio */
/* NOPRIMO */ 
  opcode.PUSH, 0,
  opcode.PR,
  opcode.HALT,
/* PRIMO */ 
  opcode.PUSH, 1,
  opcode.PR,
  opcode.HALT
]

vm.start(esprimo);
vm.push(1008);
vm.run();