// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Import aturan default Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Area proyek yang akan di-lint
  {
    "files": ["**/*.ts", "**/*.tsx"],
    "rules": {
      "quotes": ["error", "double"],      // otomatis ubah " menjadi '
      "no-unused-vars": ["error"],        // otomatis hapus variable tidak terpakai
      "semi": ["error", "always"],        // otomatis tambah ;
    },
  },

  // Abaikan folder yang tidak perlu
  {
    ignores: ["node_modules", ".next", "dist", "out"],
  },
];
