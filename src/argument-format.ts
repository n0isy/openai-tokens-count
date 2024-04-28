export function formatArguments(args: string): string {
  const lines: string[] = [];
  lines.push("{");
  const jsonObject = JSON.parse(args);
  const properties: string[] = [];
  for (const fieldName in jsonObject) {
    properties.push(`"${fieldName}":${formatValue(jsonObject[fieldName])}`);
  }
  lines.push(properties.join(",\n"));
  lines.push("}");
  return lines.join("\n");
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `"${value}"`;
  } else if (typeof value === "number") {
    return `${value}`;
  } else if (Array.isArray(value)) {
    let result = "[";
    if (value.length > 0) {
      result += value
        .map((item) => {
          if (typeof item === "string" || typeof item === "number") {
            return `"${item}"`;
          } else if (typeof item === "object") {
            if (item === null) {
              return "null";
            } else if (Array.isArray(item)) {
              return formatValue(item);
            } else {
              return formatArguments(JSON.stringify(item));
            }
          } else {
            return "null";
          }
        })
        .join(",");
    }
    result += "]";
    return result;
  } else if (typeof value === "object") {
    if (value === null) {
      return "null";
    } else {
      return formatArguments(JSON.stringify(value));
    }
  } else {
    return "null";
  }
}
