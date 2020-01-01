const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
const fuzzy = require("fuzzy");

const searchItemsFn = items => async (answers, input) => {
  input = input || "";
  var fuzzyResult = fuzzy.filter(input, items);
  return fuzzyResult.map(function(el) {
    return el.original;
  });
};

async function autocompleteQuestion({ message, items }) {
  const questions = [
    {
      type: "autocomplete",
      name: "tvShow",
      // message: "Select the folder you want to open:",
      message,
      source: searchItemsFn(items),
    },
  ];
  const { tvShow } = await inquirer.prompt(questions);
  return tvShow;
}
module.exports = {
  autocompleteQuestion,
};
