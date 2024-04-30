export function formatArguments(args: string): string {
  const lines: string[] = [];
  lines.push("{");
  const jsonObject = JSON.parse(args);
  const properties: string[] = [];
  for (const fieldName in jsonObject) {
    properties.push(`"${fieldName}":${formatValue(jsonObject[fieldName])}`);
  }
  lines.push(properties.join(","));
  lines.push("}");
  return lines.join("\n");
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    let multi = value.split("\n");
    if (multi.length>1) // idk what is actually here. But tokens are equal
      return "```\n"+JSON.stringify(value)+"\n```";
    return `"${value}"`;
  } else if (typeof value === "number") {
    return `"${value}"`;
  } else if (Array.isArray(value)) {
    let result = "[";
    if (value.length > 0) {
      result += value
        .map((item) => {
          if (item === null) {
              return "null";
            } else {
            return formatValue(item);
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
