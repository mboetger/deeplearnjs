///<reference path="./webassembly.d.ts" />
///<reference path="./wasm-arrays.d.ts" />
import {Array2D} from '../../ndarray';
import {MatrixOrientation} from '../types/matmul';

export class WASMManager {
  constructor() {}

  public matmul(a: Array2D, b:Array2D, aOrientation = MatrixOrientation.REGULAR, bOrientation = MatrixOrientation.REGULAR) {
    const returnConfig = {
      heapIn: "HEAP32", 
      heapOut: "HEAP32", 
      returnArraySize: a.size};
    let res = ccallArrays(
        "matmul", 
        "array", 
        [
	  "array", 
	  "number", 
	  "number", 
	  "array", 
	  "number", 
	  "number",
	  "number",
	  "number"], 
        [
	  a.getValues(), 
	  a.shape[0],
	  a.shape[1],
	  b.getValues(),
	  b.shape[0],
	  b.shape[1],
	  aOrientation,
	  bOrientation
	],
        returnConfig);
    return Promise.resolve(res);
  }
}
