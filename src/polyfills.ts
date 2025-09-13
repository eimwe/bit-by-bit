/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from "buffer";

// Полифилл для Buffer в браузере
if (typeof window !== "undefined") {
  (window as any).global = globalThis;
  (window as any).Buffer = Buffer;
}

export {};
