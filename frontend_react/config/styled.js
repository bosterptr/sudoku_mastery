const styledComponentsConfig = (isEnvProduction) => {
  if (isEnvProduction) {
    return {
      meaninglessFileNames: ['index', 'styles', 'component'],
      minify: true,
      transpileTemplateLiterals: true,
      displayName: false,
      ssr: false,
      fileName: false,
      pure: true,
    };
  }
  return {
    meaninglessFileNames: ['index', 'styles', 'component'],
    minify: false,
    transpileTemplateLiterals: false,
    displayName: true,
    ssr: false,
    fileName: true,
    pure: false,
  };
};

module.exports = { styledComponentsConfig };
