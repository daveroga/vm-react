import { opcode, opcodeInfo } from './opcodes.js';

export default class VirtualMachine {
  constructor() {
    this.state = 'halted';
    this.stack = [];
    this.memory = [...Array(32)].map(_ => 0);
    this.mp;
    this.code = [];
    this.flag = false;
    this.ip = 0;
    this.printFunc = (val) => console.log(val);
  }

  start(program, entryPoint = 0) {
    this.state = 'running';
    this.code = program;
    this.ip = 0;
  }

  run() {
    while (this.ip < this.code.length && this.state === 'running') {
      this.step();
    }
  }

  setPrintFunc(fn) {
    this.printFunc = fn;
  }

  pop() {
    this.stack.pop();
  }

  push(n) {
    this.stack.push(n);
  }

  get reversedStack() {
    const stackCopy = [...this.stack];
    stackCopy.reverse();
    return stackCopy;
  }

  step() {
    if (this.state !== 'running') {
      return;
    }

    const next = () => {
      const curr = this.code[this.ip++];
      if (this.ip >= this.code.length) {
        this.state = 'error';
      }
      return curr;
    };

    const push = (...args) => this.stack.push(...args);
    const pop = () => this.stack.pop();
    const top = (n) => this.stack.slice(-n);

    const arithmetic = (f) => {
      const b = pop();
      const a = pop();
      push(f(a, b));
    };

    const compare = (f) => {
      const b = pop();
      const a = pop();
      this.flag = f(a, b);
    };

    const checkMemAddr = (addr) => {
      if (addr < 0 || addr >= this.memory.length) {
        throw Error('Out of memory!');
      }
    }

    const op = next();
    switch (op) {
      case opcode.HALT: {
        this.state = 'halted';
        break;
      }
      case opcode.PUSH: {
        const arg = next();
        push(arg);
        break;
      }
      case opcode.POP: {
        pop();
        break;
      }
      case opcode.DUP: {
        push(...top(1));
        break;
      }
      case opcode.DUP2: {
        push(...top(2));
        break;
      }

      case opcode.SWAP: {
        const top = pop();
        const bottom = pop();
        push (top, bottom);
        break;
      }

      case opcode.INC: {
        push(pop() + 1);
        break;
      }
      case opcode.DEC: {
        push(pop() - 1);
        break;
      }

      case opcode.ADD: {
        arithmetic((a, b) => a + b);
        break;
      }
      case opcode.SUB: {
        arithmetic((a, b) => a - b);
        break;
      }
      case opcode.MUL: {
        arithmetic((a, b) => a * b);
        break;
      }
      case opcode.DIV: {
        arithmetic((a, b) => a / b);
        break;
      }
      case opcode.MOD: {
        arithmetic((a, b) => a % b);
        break;
      }

      case opcode.LT: {
        compare((a, b) => a < b);
        break;
      }
      case opcode.LE: {
        compare((a, b) => a <= b);
        break;
      }
      case opcode.GT: {
        compare((a, b) => a > b);
        break;
      }
      case opcode.GE: {
        compare((a, b) => a >= b);
        break;
      }
      case opcode.EQ: {
        compare((a, b) => a === b);
        break;
      }
      case opcode.NEQ: {
        compare((a, b) => a !== b);
        break;
      }

      case opcode.BR: {
        this.ip = next();
        break;
      }
      case opcode.BRT: {
        const addr = next();
        if (this.flag) {
          this.ip = addr;
        }
        break;
      }
      case opcode.BRF: {
        const addr = next();
        if (!this.flag) {
          this.ip = addr;
        }
        break;
      }

      case opcode.LOAD: {
        const addr = pop();
        checkMemAddr(addr);
        push(this.memory[addr]);
        break;
      }

      case opcode.STORE: {
        const addr = pop();
        checkMemAddr(addr);
        this.memory[addr] = pop();
        this.mp = addr;
        break;
      }

      case opcode.PR: {
        this.printFunc(pop());
        break;
      }

      default: {
        this.state = 'error';
      }
    }
  }

  assemble(src) {
    const code = [];
    const bytes = src.split(/\s+/).filter((s) => s !== '');
    const labels = new Map();

    const isLabel = (s) => s.slice(-1) === ':';

    let ip = 0;
    for (const byte of bytes) {
      if (isLabel(byte)) {
        labels.set(byte.slice(0, -1), ip);
      } else {
        ip++;
      }
    }

    console.log(labels);

    let i = 0;
    while (i < bytes.length) {
      const name = bytes[i++];
      if (isLabel(name)) {
        continue;
      }
      if (!opcode.hasOwnProperty(name.toUpperCase())) {
        throw new Error(`Unknown instruction ${name}`);
      }
      const op = opcode[name.toUpperCase()];
      code.push(op);

      const info = opcodeInfo[op];
      for (let j = 0; j < info.nargs; j++) {
        const val = bytes[i++];
        if (labels.has(val)) {
          code.push(labels.get(val));
        } else {
          code.push(parseInt(val));
        }
      }
    }

    this.code = code;
    this.state = 'running';
    this.ip = 0;
  }


  disassemble() {
    const instructions = [];
    let i = 0;
    while (i < this.code.length) {
      const info = opcodeInfo[this.code[i]];
      if (!info) {
        throw new Error('Opcode not found!');
      }
      instructions.push({
        name: info.name,
        args: this.code.slice(i + 1, i + 1 + info.nargs),
        current: i === this.ip,
      });
      i += 1 + info.nargs;
    }

    return instructions;
  }

  memoryState() {
    const memorycells = [];
    this.memory.map((m, index) => memorycells.push({ 
      value: m,
      current: index === this.mp  
    }));

    return memorycells;
  }
}
