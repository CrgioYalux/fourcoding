type ArrayLengthMutationOperations =
	| 'splice'
	| 'push'
	| 'pop'
	| 'shift'
	| 'unshift';

type FixedLengthArray<T, K extends number, Arr = [T, ...Array<T>]> = Pick<
	Arr,
	Exclude<keyof Arr, ArrayLengthMutationOperations>
> & {
	[I: number]: T;
	readonly length: K;
	[Symbol.iterator]: () => IterableIterator<T>;
};

function arrayToFixedLengthArray<T, K extends number>(
	arr: any[]
): FixedLengthArray<T, K> {
	return arr as unknown as FixedLengthArray<T, K>;
}

export type { FixedLengthArray };
export { arrayToFixedLengthArray };
