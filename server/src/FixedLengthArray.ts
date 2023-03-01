type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
type FixedLengthArray<T, K extends number, Arr = [T, ...Array<T>]> =
    Pick<Arr, Exclude<keyof Arr, ArrayLengthMutationKeys>>
    & {
        [ I : number ] : T,
        readonly length: K,
        [Symbol.iterator]: () => IterableIterator<T>
    }

export type { FixedLengthArray };
