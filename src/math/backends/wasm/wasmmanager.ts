///<reference path="./webassembly.d.ts" />

export class WASMManager {
  private wasmInstance: WebAssembly.Instance|null = null;
  private wasmModule: WebAssembly.Module|null = null;
  private exports: any = null;
  private memory: WebAssembly.Memory|null = null;
  private wasmCode = "AGFzbQEAAAABBQFgAAF/AlQFA2VudgZtZW1vcnkCAYACgAIDZW52BXRhYmxlAXABAAADZW52Cm1lbW9yeUJhc2UDfwADZW52CXRhYmxlQmFzZQN/AANlbnYIU1RBQ0tUT1ADfwADAgEABg4CfwEjAgt9AUMAAAAACwcLAQdfbWF0bXVsAAAJAQAKDQELAQJ/IwMhAUEGDws=";

  constructor() {}

  public load() {
    const decoded = atob(this.wasmCode);
    const length = decoded.length;
    const bytes = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    this.memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
    const imports = {
        env: {
            abortStackOverflow: () => { throw new Error('overflow'); },
            memoryBase: 1024,
            tableBase: 0,
            memory: this.memory,
            table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
            STACKTOP: 0,
            STACKMAX: this.memory.buffer.byteLength,
        }
    };

    WebAssembly.instantiate(bytes, imports).then((results) => {
      console.log('Matmul: ' + results.instance.exports._matmul());
      this.wasmModule = results.module;
      this.wasmInstance = results.instance;
      this.exports = results.instance.exports;
    }).catch(err => console.warn('err loading wasm', err));
  }

  public matmul() {
    if (this.exports == null || this.wasmModule == null || this.wasmInstance == null) {
      console.log('Exports null - matmul called before WebAssembly instantiate finished.');
      return 1;
    }
    return this.exports._matmul();
  }
}
