
export function deepClone<T>(src: T): T {
   if (src === null || src === undefined) { return src; }
   const json = JSON.stringify(src);
   const clone = JSON.parse(json);
   return clone as T;
}