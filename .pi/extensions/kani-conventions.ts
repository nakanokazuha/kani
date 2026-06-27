import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const skillsDir = resolve(dir, "../skills");

export default function kaniPlugin(pi: any) {
  pi.on("resources_discover", async () => ({
    skillPaths: [skillsDir],
  }));
}