module.exports = {
  '*.{js,jsx,ts,tsx}': ['yarn lint', 'yarn type-check', 'yarn format'],
  '*.{json,md,mdx,css,html,yml,yaml}': 'yarn format',
};
