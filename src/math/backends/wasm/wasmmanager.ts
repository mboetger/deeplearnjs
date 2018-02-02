///<reference path="./webassembly.d.ts" />

export class WASMManager {
  private loading: Promise<void|WebAssembly.ResultObject>|null = null;
  private wasmInstance: WebAssembly.Instance|null = null;
  private wasmModule: WebAssembly.Module|null = null;
  private exports: any = null;
  private memory: WebAssembly.Memory|null = null;
  private wasmCode = "AGFzbQEAAAABBQFgAAF/AlQFA2VudgZtZW1vcnkCAYACgAIDZW52BXRhYmxlAXABAAADZW52Cm1lbW9yeUJhc2UDfwADZW52CXRhYmxlQmFzZQN/AANlbnYIU1RBQ0tUT1ADfwADAgEABg4CfwEjAgt9AUMAAAAACwcLAQdfbWF0bXVsAAAJAQAKDQELAQJ/IwMhAUEGDws=";

  constructor() {
    this.load().then(() => {});
  }

  public load() {
    if (this.wasmModule && this.wasmInstance) {
      return Promise.resolve({
	'module': this.wasmModule,
	'instance': this.wasmInstance
      });
    }

    if (this.loading) {
      return this.loading;
    }

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

    this.loading = WebAssembly.instantiate(bytes, imports).then((results) => {
      this.exports = results.instance.exports;
      this.wasmModule = results.module;
      this.wasmInstance = results.instance;
      return results;
    }).catch(err => console.warn('err loading wasm', err));

    return this.loading;
  }

  public matmul() {
    return this.load().then((results) => {
      return this.exports._matmul();
    });
  }
}
