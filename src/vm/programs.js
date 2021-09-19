const sumasimple = `
push 1
push 2
add
pr
halt
`;

const ceroadiez = `
  push 0
begin:
  dup
  pr
  dup
  push 10
  ge
  brt end
  inc
  br begin
end:
  halt
`.slice(1);

const fillmemory = `
  push 0
  push 0
inicio:
  dup2
  store
  inc
  swap
  inc
  swap
  dup
  push 32
  lt
  brt inicio
  pop
  pop
  halt`.slice(1);

export default {
  sumasimple,
  ceroadiez,
  fillmemory,
}