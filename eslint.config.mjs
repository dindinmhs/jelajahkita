const isProd = process.env.NODE_ENV === "production";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: isProd
      ? {
          "no-unused-vars": "off",
          "no-undef": "off",
        }
      : {},
  },
];

export default eslintConfig;
