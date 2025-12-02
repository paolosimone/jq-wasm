export interface JQ {
  invoke(input: string, filter: string, options?: string[]): Promise<string>,
  version(): Promise<string>
}

export default function newJQ(module?: any): Promise<JQ>;
