
export type ObservableCallbackFunction<T> = (result: T) => (void | Promise<void>);
export type ObservableCallback<T> = ObservableCallbackFunction<T>;

export interface IObservable<T> {
   subscribe: (callback: ObservableCallback<T>) => ISubscription;
}

export interface IObservableQuery<T> extends IObservable<T> {
   asPromise: () => Promise<T>;
}

export interface ISubscription {
   unsubscribe: () => void
}