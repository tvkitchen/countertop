// We truly want this utility type to work with functions having *any* types of
// Paramters or ReturnType, which is why we have to use `any` here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionSignature<T extends (...args: any) => any> = (
	(...args: Parameters<T>) => ReturnType<T>
)
