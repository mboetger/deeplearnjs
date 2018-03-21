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

  float get(float* matrix, int i, int16_t iSize, int j, int16_t jSize, int8_t orientation) {
    if (orientation == 0) {
      return *(matrix + i * jSize + j);
    } else {
      return *(matrix + j * iSize + i);
    }
  }

  EMSCRIPTEN_KEEPALIVE
  float* matmul(float *a, int32_t aSize, int16_t aShape0, int16_t aShape1, float *b, int32_t bSize, int16_t bShape0, int16_t bShape1, int8_t aOrientation, int8_t bOrientation) {
    float values[aSize];
    
    int16_t sharedDim = aOrientation == 0 ? aShape1 : aShape0;
    int16_t leftDim = aOrientation == 0 ? aShape0 : aShape1;
    int16_t rightDim = bOrientation == 0 ? bShape1 : bShape0;

    int index = 0;
    for (int i=0; i < leftDim; ++i) {
      for (int j=0; j < rightDim; ++j) {
        float sum = 0;
	for (int k=0; k < sharedDim; ++k) {
          sum += get(a, i, leftDim, k, sharedDim, aOrientation) * get(b, k, sharedDim, j, rightDim, bOrientation);
	}
        values[index++] = sum;
      }
    }

    auto arrayPtr = &values[0];
    return arrayPtr;
  }
}
