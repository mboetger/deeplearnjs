#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#include <emscripten/emscripten.h>

int main(int argc, char const *argv[]) {
      emscripten_run_script("typeof window!='undefined' && window.dispatchEvent(new CustomEvent('wasmLoaded'))");
          return 0;
}

extern "C" {

  EMSCRIPTEN_KEEPALIVE
  int8_t* matmul(int8_t *buf, int bufSize) {
    int8_t values[bufSize];
    for (int i=0; i<bufSize; i++) {
      values[i] = buf[i] * 2;
    }

    auto arrayPtr = &values[0];
    return arrayPtr;
  }
}
