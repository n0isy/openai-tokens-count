import { formatArguments } from "./argument-format";

export function tryFormatJSON(content: string): any {
  try {
    return JSON.parse(content);
  } catch (ignored) {
    return null;
  }
}

export function isJSONString(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch (ignored) {
    return false;
  }
}

export function formatToolContent(content: unknown): string {
  try {
    JSON.parse(content as string);
    return formatArguments(content as string);
  } catch (ex) {
    // error
  }
  return content as string;
}
