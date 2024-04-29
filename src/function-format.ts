import OpenAI from "openai";

const IDENT_DEFAULT= 0;
const IDENT_INCREMENT = 0;

export function formatFunctionDefinitions(
  tools: OpenAI.ChatCompletionTool[],
): string {
  const lines: string[] = [];
  lines.push("namespace functions {");
  lines.push("");
  for (const tool of tools) {
    const func = tool.function;
    if (func?.description) {
      lines.push(`// ${func.description}`);
    }
    const p = JSON.parse(JSON.stringify(func?.parameters));
    const properties = p?.properties;
    if (properties && Object.keys(properties).length > 0) {
      lines.push(`type ${func?.name} = (_: {`);
      lines.push(formatObjectProperties(p, IDENT_DEFAULT));
      lines.push("}) => any;");
    } else {
      lines.push(`type ${func?.name} = () => any;`);
    }
    lines.push("");
  }
  lines.push("} // namespace functions");
  return lines.join("\n");
}

function formatObjectProperties(p: any, indent: number): string {
  const properties = p?.properties;
  if (!properties) {
    return "";
  }
  const requiredParams = p?.required || [];
  const lines: string[] = [];
  for (const key in properties) {
    const props = properties[key];
    const description = props?.description;
    if (description) {
      lines.push(`// ${description}`);
    }
    const question = requiredParams.includes(key) ? "" : "?";
    lines.push(
      `${" ".repeat(indent)}${key}${question}: ${formatType(props, indent)},`,
    );
  }
  return lines.join("\n");
}

function formatType(props: any, indent: number): string {
  const type = props?.type;
  switch (type) {
    case "string":
      if ("enum" in props) {
        return props.enum.map((item: string) => `"${item}"`).join(" | ");
      }
      return "string";
    case "array":
      if ("items" in props) {
        if (props.items?.type === "object" || props.items?.type === "array") {
          return `Array<\n${formatType(props.items, indent)}\n>`;
        } else {
          return `${formatType(props.items, indent)}[]`;
        }
      }
      return "Array<any>";
    case "object":
      return `{\n${formatObjectProperties(props, indent + IDENT_INCREMENT)}\n${" ".repeat(indent)}}`;
    case "integer":
    case "number":
      if ("enum" in props) {
        return props.enum.map((item: string) => `"${item}"`).join(" | ");
      }
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    default:
      return "";
  }
}
