var Generator = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Page name',
        validate: str => { 
          if (str.trim().length > 0) {
            return true;
          }
          return 'Please add a name for your new page'
        }
      },
      {
        type: 'input',
        name: 'title',
        message: 'Page title',
        validate: str => { 
          if (str.trim().length > 0) {
            return true;
          }
          return 'Please add a name for your new page'
        }
      },
    ]).then(answers => {
      this.answers = {
        name: answers.name,
        title: answers.title
      };
    });
  }

  writing() {
    const { name, title } = this.answers;
    const nameWithLowerCase = name.charAt(0).toLowerCase() + name.slice(1);
    const className = `${nameWithLowerCase}-page`;
    const component = name.charAt(0).toUpperCase() + name.slice(1);
    // create folder project
    mkdirp(`pages/${nameWithLowerCase}`);
    // copy page into the pages folder
    this.fs.copyTpl(
      this.templatePath('_page.js'),
      this.destinationPath(`pages/${nameWithLowerCase}/${nameWithLowerCase}.js`),
      {
        component,
        className,
        i18n: nameWithLowerCase,
        title
      }
    );
    // copy index.js
    this.fs.copyTpl(
      this.templatePath('_index.js'),
      this.destinationPath(`pages/${nameWithLowerCase}/index.js`),
      {
        component,
        nameWithLowerCase
      }
    );
    // copy styles.scss
    this.fs.copyTpl(
      this.templatePath('_styles.scss'),
      this.destinationPath(`pages/${nameWithLowerCase}/${nameWithLowerCase}.scss`),
      {
        className
      }
    );
    // copy i18n.json
    this.fs.copyTpl(
      this.templatePath('_i18n.json'),
      this.destinationPath(`static/locales/en/${nameWithLowerCase}.json`),
      {
        title
      }
    );
    // copy unit test.js
    this.fs.copyTpl(
      this.templatePath('_test.js'),
      this.destinationPath(`tests/units/pages/${nameWithLowerCase}.test.js`),
      {
        component,
        nameWithLowerCase
      }
    );

    // update server.js to add the new namespace to the list
    this.fs.copy('./server.js', './server.js', {
      process: function(content) {
          var regEx = new RegExp(/\/\* new-i18n-namespace-here \*\//, 'g');
          var newContent = content.toString().replace(regEx, `, '${nameWithLowerCase}'/* new-i18n-namespace-here */`);
          return newContent;
      }
    });

    // update main.scss to add the new page stylesheet
    this.fs.copy('./styles/main.scss', './styles/main.scss', {
      process: function(content) {
          var regEx = new RegExp(/\/\* new-page-stylesheet-goes-here \*\//, 'g');
          var newContent = content.toString().replace(regEx, `@import '~@root/pages/${nameWithLowerCase}/${nameWithLowerCase}.scss';\n/* new-page-stylesheet-goes-here */`);
          return newContent;
      }
    });
  }
};
