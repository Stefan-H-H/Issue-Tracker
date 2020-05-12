# StefanHristov-Book  
Work through Pro MERN Stack 2nd Ed
---
## Chapter 2
### Summary:
Served as an introduction to how React applications can be built. Provides an introduction using Node.js and NPM. Also installed Babel in order to be able to transpile code for support of older browsers.

![ch02](/readme_images/chapter2_hello_continents.png)

### Chapter 2 Notes:

- React is a Javascript file that comes in two parts:
    1. The first is the React core module, the one responsible for dealing with React components, their state manipulation, etc.
    2. The second is teh ReactDOM module, which deals with converting React components to a DOM that the browser can understand.
 - JSX (JavaScript XML) is a React markup language with similar syntax to HTML.
- Babel is used to compile JSX into regular JavaScript to be injected and used by the browser.
- npm (Node Package Manager) is powerful with many options. The location of installed files under a project directory is a concious choice made by the makes of npm. It has three (3) important effects:
    1. All installations are *local* to the project directory. THis means that a different project can use a different version of any of the installed packages.
    2. A package's dependencies are also isolated within the package.
    3. Administrator (superuser) rights are note needed to install a package.
- Command to start the server: `npm start`.
- To determine the babel version after installation without local directory file path constraints, the command  `npx babel --version` can be executed at the command line.
- Custom `npm run` scripts can be written and added to the `package.json` file. 
- `npm run watch` shortcut command was implemented. It's purpose is to watch the client-side code where the source files are changed frequently, and automatically recompile.
- `npm start` shortcut command was implemented. It's purpsoe is to restart `Node.js` whenever there is a change in a set of files. Here we make sure that ther `server` directory is tracked for changes, and `Node.js` is restarted accordingly..
- When the command  `npm run watch` is exectued a JSX transform is performed, but it doesn't return to the shell. It waits in a permanent loop by watching for changes in the source files. In order to run the server, another terminal is needed, where `npm start` can be exectued.

### Errors & Issues:
 - Listing 2-1 should read  `ReactDOM.render(element, document.getElementByID('contents'));`. The listing has a typo and passs the argument `content` instead of `contents` inside the `getElementByID()` method. The typo causes the method to return `null` and not properly render *"Hello World"* becauseno element with that ID exists.
 - For build time JSX transformation, babel tools needed to be installed. I had an issue with installation. Resolved after realizing that `npm install --save-dev @babel/core@7 @babel/cli@7` needed to be executed within the `src` folder.
 - Listing 2-7 is missing an opening `<` and should read  `<script src="App.js></script>`.
