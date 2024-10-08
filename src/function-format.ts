import OpenAI from "openai";

const IDENT_DEFAULT = 0;
const IDENT_INCREMENT = 0;

export function formatFunctionDefinitions(
  tools: OpenAI.Chat.ChatCompletionTool[],
): string {
  const lines: string[] = [];
  lines.push("# Tools");
  lines.push("");
  lines.push("## functions");
  lines.push("");
  lines.push("namespace functions {");
  lines.push("");
  for (const tool of tools) {
    const func = tool.function;
    func?.description?.split("\n").forEach( (row: string) => lines.push(`// ${row}`));
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
  lines.push("");
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
    props?.description?.split("\n").forEach( (row: string) => lines.push(`// ${row}`));
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
