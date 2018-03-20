#!/usr/bin/env bash

emcc src/math/backends/wasm/matmul.cpp -s WASM=1 -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" -s EXPORTED_FUNCTIONS="['_matmul']" -o demos/benchmarks/matmul.js
cp src/math/backends/wasm/matmul.wasm demos/benchmarks/matmul.wasm
scripts/build-npm.sh
rm -rf demos/node_modules/deeplearn/* && tar -zxf deeplearn-0.4.1.tgz -C /tmp/ && mv -f /tmp/package/dist/* demos/node_modules/deeplearn/
cp src/math/backends/wasm/wasm-arrays.d.ts demos/node_modules/deeplearn/math/backends/wasm/
cp src/math/backends/wasm/webassembly.d.ts demos/node_modules/deeplearn/math/backends/wasm/
sed -i.bak s#../../../../src/math/backends/wasm/##g demos/node_modules/deeplearn/math/backends/wasm/wasmmanager.d.ts
