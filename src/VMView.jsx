import React, { useState, useEffect } from 'react';
import './VMView.css';
import VirtualMachine from './vm/vm';
import programs from './vm/programs';

const vm = new VirtualMachine();

const useRefresh = () => {
  const [tick, setTick] = useState(0);
  return () => setTick(tick + 1);
};

const StackValue = ({ val }) => {
  return <div className="stack-value">{val}</div>;
};

const Instruction = ({ name, args, current }) => {
  return (
    <div className={'instr' + (current ? ' current' : '')}>
      {name}{' '}
      {args.map((a) => (
        <span>{a}</span>
      ))}
    </div>
  );
};

const MemCell = ({ value, current }) => {
  return <div className={'cell' + (current ? ' current' : '')}>{value}</div>;
};

function VMView() {
  const refresh = useRefresh();
  const [val, setVal] = useState(0);
  const [src, setSrc] = useState(programs.ceroadiez);
  const [output, setOutput] = useState([]);

  useEffect(() => {
    vm.setPrintFunc((val) => setOutput((output) => [...output, val]));
  }, []);

  const push = () => {
    vm.push(val);
    refresh();
  };
  const pop = () => {
    vm.pop();
    refresh();
  };
  const assemble = () => {
    vm.assemble(src);
    refresh();
  };
  const step = () => {
    vm.step();
    refresh();
  };
  const run = () => {
    vm.run();
    refresh();
  };
  const clear = () => {
    vm.stack = [];
    setOutput([]); //ya hace el refresh
  };
  const changeSrc = (e) => {
    setSrc(programs[e.target.value]);
  };

  return (
    <main>
      <header>
        <div className="state">VM is {vm.state}</div>
        <div className="buttons">
          <button onClick={pop}>Pop</button>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <button onClick={push}>Push</button>
          <button onClick={step}>Step</button>
          <button onClick={assemble}>Assemble</button>
          <button onClick={run}>Run</button>
          <button onClick={clear}>Clear</button>
          <select onChange={changeSrc}>
            {Object.keys(programs).map((prog) => (
              <option value={prog}>{prog}</option>
            ))}
          </select>
        </div>
      </header>
      <div className="memory">
        {vm.memoryState().map((cell) => (
          <MemCell {...cell} />
        ))}
      </div>
      <div className="content">
        <div className="stack">
          {vm.reversedStack.map((val) => (
            <StackValue val={val} />
          ))}
          <h4>Stack</h4>
        </div>
        <div className="code">
          {vm.disassemble().map((instr) => (
            <Instruction {...instr} />
          ))}
        </div>
        <div className="editor">
          <textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          ></textarea>
          <div className="output">
            <h4>Output</h4>
            <div className="lines">
              {output.map((line) => (
                <div>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VMView;
