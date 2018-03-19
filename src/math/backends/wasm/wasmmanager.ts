///<reference path="./webassembly.d.ts" />
///<reference path="./wasm-arrays.d.ts" />

export class WASMManager {
  constructor() {}

  public matmul() {
    const returnConfig = {
      heapIn: "HEAP8", 
      heapOut: "HEAP8", 
      returnArraySize: 5};
    let res = ccallArrays(
        "matmul", 
        "array", 
        ["array"], 
        [[1,2,3,4,5]], 
        returnConfig);
    return Promise.resolve(res[0]);
  }
}
