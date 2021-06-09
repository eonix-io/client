
import { boardQuery } from '..';
import { uuidEmpty } from '../..';
import { GraphCacheMiddleware } from './GraphCacheMiddleware';
import { IQueryOptions } from './IQueryOptions';
import { nextTick } from './nextTick';

const emptyObservable = {
   subscribe() {
      return {
         unsubscribe() {
            //
         }
      };
   }
};

let cache = new GraphCacheMiddleware();

afterEach(() => {

   cache = new GraphCacheMiddleware();

});

describe('basic functionality', () => {

   test('expect no cache entry', () => {

      const query = boardQuery(uuidEmpty);
      const isCached = cache.isCached({ query: query.query, variables: query.variables });

      expect(isCached).toBe(false);

   });

   test('does not call next until subscribed', async () => {
      const query = boardQuery(uuidEmpty) as IQueryOptions<any, any>;

      let callCount = 0;
      const obs = cache.intercept(query, () => {
         callCount++;
         return emptyObservable;
      });

      await nextTick();
      expect(callCount).toBe(0);

      obs.subscribe(() => {
         //
      });

      await nextTick();
      expect(callCount).toBe(1);

   });

});

describe('cached value tests', () => {

   const query = boardQuery(uuidEmpty) as IQueryOptions<any, any>;
   let subscription!: { unsubscribe: () => void };

   beforeEach(async () => {

      const obs = cache.intercept(query, () => {
         return emptyObservable;
      });

      subscription = obs.subscribe(() => {
         //
      });

   });

   it('is cached', () => {
      const v = cache.isCached(query);
      expect(v).toBe(true);
   });

   it('does not call next again', async () => {

      let called = false;
      const obs = cache.intercept(query, () => {
         called = true;
         return emptyObservable;
      });

      obs.subscribe(() => {
         //
      });

      await nextTick();
      expect(called).toBe(false);

   });

   it('removes cache on all unsubscribed', async () => {
      subscription.unsubscribe();
      await nextTick();
      const x = cache.isCached(query);
      expect(x).toBe(false);
   });

});




