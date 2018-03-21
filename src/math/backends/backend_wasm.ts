
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ENV} from '../../environment';
import {Conv2DInfo} from '../conv_util';
// tslint:disable-next-line:max-line-length
import {Array1D, Array2D, Array3D, Array4D, DataType, DataTypeMap, NDArray, Rank} from '../ndarray';
import {SumTypes} from '../types';

import {MathBackend} from './backend';
import {MatrixOrientation} from './types/matmul';
import {WASMManager} from './wasm/wasmmanager';

export interface WasmData {
  p: Promise<DataTypeMap[DataType]>;
  shape: number[];
  dtype: DataType;
  values: DataTypeMap[DataType];
}

export class MathBackendWASM implements MathBackend {
  private data: {[dataId: number]: WasmData} = {};
  private wasmManager: WASMManager = null;

  constructor(wasmManager: WASMManager = new WASMManager()) {
    this.wasmManager = wasmManager;
  }

  matMul(
      a: Array2D, b: Array2D, aOrientation = MatrixOrientation.REGULAR,
      bOrientation = MatrixOrientation.REGULAR): Array2D {

    const leftDim =
        (aOrientation === MatrixOrientation.REGULAR) ? a.shape[0] : a.shape[1];
    const rightDim =
        (bOrientation === MatrixOrientation.REGULAR) ? b.shape[1] : b.shape[0];

    const output =
        this.makeOutputArray([leftDim, rightDim], 'float32') as Array2D<'float32'>;
    this.throwIfNoData(output.dataId);
    this.data[output.dataId].p = this.wasmManager.matmul(a, b, aOrientation, bOrientation).then((result) => {
      this.data[output.dataId].values = result;
      return result;
    }) ;
    return output;
  }

  private makeOutputArray<D extends DataType, T extends NDArray<D>>(
      shape: number[], dtype: D): T {
    return NDArray.make(shape, {}, dtype) as T;
  }

  clone<T extends NDArray>(ndarray: T): T {
    throw new Error('Not implemented');
  }

  async read<D extends DataType>(dataId: number): Promise<DataTypeMap[D]> {
    this.throwIfNoData(dataId);
    return this.data[dataId].p;
  }

  readSync<D extends DataType>(dataId: number): DataTypeMap[D] {
    this.throwIfNoData(dataId);
    return this.data[dataId].values;
  }

  write<D extends DataType>(dataId: number, values: DataTypeMap[D]): void {
    if (values == null) {
      throw new Error('MathBackendWASM.write(): values can not be null');
    }
    this.throwIfNoData(dataId);
    this.data[dataId].values = values;
  }

  writePixels(
      dataId: number,
      pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement,
      numChannels: number): void {
    throw new Error('Not implemented');
  }

  slice1D(x: Array1D, begin: number, size: number): Array1D {
    throw new Error('Not implemented');
  }

  slice2D(x: Array2D, begin: [number, number], size: [number, number]): Array2D {
    throw new Error('Not implemented');
  }

  slice3D(x: Array3D, begin: [number, number, number], size: [
    number, number, number
  ]): Array3D {
    throw new Error('Not implemented');
  }

  slice4D(x: Array4D, begin: [number, number, number, number], size: [
    number, number, number, number
  ]): Array4D {
    throw new Error('Not implemented');
  }

  concat1D(a: Array1D, b: Array1D): Array1D {
    throw new Error('Not implemented');
  }

  concat2D(a: Array2D, b: Array2D, axis: number): Array2D {
    throw new Error('Not implemented');
  }

  concat3D(a: Array3D, b: Array3D, axis: number): Array3D {
    throw new Error('Not implemented');
  }

  concat4D(a: Array4D, b: Array4D, axis: number): Array4D {
    throw new Error('Not implemented');
  }

  neg<T extends NDArray>(a: T): T {
    throw new Error('Not implemented');
  }

  add<D extends DataType>(a: NDArray<D>, b: NDArray<D>): NDArray<D> {
    throw new Error('Not implemented');
  }

  subtract<D extends DataType>(a: NDArray<D>, b: NDArray<D>): NDArray<D> {
    throw new Error('Not implemented');
  }

  multiply<D extends DataType>(a: NDArray<D>, b: NDArray<D>): NDArray<D> {
    throw new Error('Not implemented');
  }

  divide<D extends DataType>(a: NDArray<D>, b: NDArray<D>): NDArray<'float32'> {
    throw new Error('Not implemented');
  }

  sum<D extends DataType>(x: NDArray<D>, axes: number[]): NDArray<SumTypes[D]> {
    throw new Error('Not implemented');
  }

  argMin(x: NDArray, axes: number[]): NDArray<'int32'> {
    throw new Error('Not implemented');
  }

  argMax(x: NDArray, axes: number[]): NDArray<'int32'> {
    throw new Error('Not implemented');
  }

  equal(a: NDArray, b: NDArray): NDArray<'bool'> {
    throw new Error('Not implemented');
  }

  notEqual(a: NDArray, b: NDArray): NDArray<'bool'> {
    throw new Error('Not implemented');
  }
  topKValues<D extends DataType, T extends NDArray<D>>(x: T, k: number):
      Array1D<D> {
    throw new Error('Not implmented');
  }
  topKIndices(x: NDArray, k: number): Array1D<'int32'> {
    throw new Error('Not implmented');
  }

  min<D extends DataType>(x: NDArray<D>, axes: number[]): NDArray<D> {
    throw new Error('Not implmented');
  }

  minimum<D extends DataType>(a: NDArray<D>, b: NDArray<D>): NDArray<D> {
    throw new Error('Not implmented');
  }

  max<D extends DataType>(x: NDArray<D>, axes: number[]): NDArray<D> {
    throw new Error('Not implmented');
  }

  maximum<D extends DataType>(a: NDArray<D>, b: NDArray<D>): NDArray<D> {
    throw new Error('Not implmented');
  }

  ceil<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  floor<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  pow<T extends NDArray>(a: T, b: NDArray<'int32'>): T {
    throw new Error('Not implmented');
  }

  exp<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  log<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  sqrt<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  square<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  relu<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  elu<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  eluDer<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  selu<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  leakyRelu<T extends NDArray>(x: T, alpha: number): T {
    throw new Error('Not implmented');
  }

  prelu<T extends NDArray>(x: T, alpha: T): T {
    throw new Error('Not implmented');
  }

  preluDer<T extends NDArray>(x: T, alpha: T): T {
    throw new Error('Not implmented');
  }

  int<R extends Rank>(x: NDArray<DataType, R>): NDArray<'int32', R> {
    throw new Error('Not implmented');
  }

  clip<T extends NDArray>(x: T, min: number, max: number): T {
    throw new Error('Not implmented');
  }

  abs<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  sigmoid<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  sin<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  cos<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  tan<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  asin<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  acos<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  atan<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  sinh<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  cosh<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  tanh<T extends NDArray>(x: T): T {
    throw new Error('Not implmented');
  }

  step<T extends NDArray>(x: T, alpha: number): T {
    throw new Error('Not implmented');
  }

  conv2d(x: Array4D, filter: Array4D, bias: Array1D|null, convInfo: Conv2DInfo):
      Array4D {
    throw new Error('Not implmented');
  }

  conv2dDerInput(dy: Array4D, filter: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  conv2dDerFilter(x: Array4D, dY: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  conv2dDerBias(dY: Array4D): Array1D {
    throw new Error('Not implmented');
  }

  depthwiseConv2D(input: Array4D, filter: Array4D, convInfo: Conv2DInfo):
      Array4D {
    throw new Error('Not implmented');
  }

  maxPool(x: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  maxPoolBackprop(dy: Array4D, x: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  minPool(x: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  avgPool(x: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  avgPoolBackprop(dy: Array4D, x: Array4D, convInfo: Conv2DInfo): Array4D {
    throw new Error('Not implmented');
  }

  tile<D extends DataType, T extends NDArray<D>>(x: T, reps: number[]): T {
    throw new Error('Not implmented');
  }

  transpose<D extends DataType, T extends NDArray<D>>(x: T, perm: number[]): T {
    throw new Error('Not implmented');
  }

  resizeBilinear3D(
      x: Array3D, newShape2D: [number, number], alignCorners: boolean): Array3D {
    throw new Error('Not implmented');
  }

  batchNormalization2D(
      x: Array2D, mean: Array2D|Array1D, variance: Array2D|Array1D,
      varianceEpsilon: number, scale?: Array2D|Array1D,
      offset?: Array2D|Array1D): Array2D {
    throw new Error('Not implmented');
  }

  batchNormalization3D(
      x: Array3D, mean: Array3D|Array1D, variance: Array3D|Array1D,
      varianceEpsilon: number, scale?: Array3D|Array1D,
      offset?: Array3D|Array1D): Array3D {
    throw new Error('Not implmented');
  }

  batchNormalization4D(
      x: Array4D, mean: Array4D|Array1D, variance: Array4D|Array1D,
      varianceEpsilon: number, scale?: Array4D|Array1D,
      offset?: Array4D|Array1D): Array4D {
    throw new Error('Not implmented');
  }

  localResponseNormalization4D(
      x: Array4D, radius: number, bias: number, alpha: number, beta: number,
      normRegion: 'acrossChannels'|'withinChannel'): Array4D {
    throw new Error('Not implmented');
  }

  multinomial(probabilities: Array2D, numSamples: number, seed: number):
      Array2D<'int32'> {
    throw new Error('Not implmented');
  }

  oneHot(indices: Array1D, depth: number, onValue: number, offValue: number):
      Array2D {
    throw new Error('Not implmented');
  }

  async time(query: () => NDArray): Promise<number> {
    throw new Error('Not implemented');
  }

  register(dataId: number, shape: number[], dtype: DataType): void{
    if (dataId in this.data) {
      throw new Error(`data id ${dataId} already registered`);
    }
    this.data[dataId] = {
      shape,
      dtype,
      values:null,
      p:null
    };
  }

  disposeData(dataId: number): void {
    delete this.data[dataId];
  }

  dispose() {}

  private throwIfNoData(dataId: number) {
    if (!(dataId in this.data)) {
      throw new Error(
          `No data found for NDArray with data id ${dataId}. ` +
          `Use dl.ENV.math instead of constructing your own NDArrayMath. ` +
          `If you need to construct your own math, make sure this array is ` +
          `allocated after the math construction`);
    }
  }
}

ENV.registerBackend('wasm', () => new MathBackendWASM());
