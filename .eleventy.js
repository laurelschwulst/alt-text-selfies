module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy('assets');

    eleventyConfig.setTemplateFormats(["md", "njk"]);

    eleventyConfig.addCollection("selfies", function(collection) {
      // Filter the collection to include only selfies, and sort it randomly
      return collection.getAll().filter(item => item.inputPath.startsWith('./selfies/')).sort((a, b) => Math.random() - 0.5);
    });

};