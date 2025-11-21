import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@uih-dsl/codegen-react",
    "@uih-dsl/codegen-vue",
    "@uih-dsl/codegen-svelte",
    "@uih-dsl/ir",
    "@uih-dsl/parser",
    "@uih-dsl/tokenizer",
  ],
};

export default withNextIntl(nextConfig);