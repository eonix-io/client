
export function nextTick(): Promise<void> {
   return new Promise<void>(r => {
      setTimeout(r);
   });
}