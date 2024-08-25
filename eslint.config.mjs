import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'antfu/no-import-dist': 'off',
  },
}, {
  ignores: [
    'src/ignore.js',
  ],
})
