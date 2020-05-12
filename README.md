# StefanHristov-Book  
Work through Pro MERN Stack 2nd Ed
---
## Chapter 3
### Summary & Functionality Added:
The purpose of this chapter was to introduce React components, and to use composition for composing larger elements. The functionality added during this chapter included using React classes instead of elements to depict components, and using `map()` to generate components based on an array of input data. The generaged components are placeholders thus far for some components yet to be developed, but provided a skeleton structure for the main page of the Issue Tracker application.


### Chapter 3 Notes:

#### React Classes:
- React classes are created by extending `React`. `Component`, the base class from which all custom classes must be derived. With the class dfinition, at minimum a `render()` method is needed. This method is what React calls to display the component in the UI. `render()` must be provided otherwise the component will have no screen presence. The `render()` function is supposed to return an element( either native HTML or another React component).
- Since `render()` returns only a single element, if one wants to return multiple, then ther are two options:
    1. Create a single `<div>` element that encloses the other elements; or
    2. Return a `React.Fragment` component that encloses the other elements. The `Fragment` component is like an enclosing `<div>` but has no effect on the `DOM`.
- Run time errors for the React library can be seen in the browser JavaScript Console. Similarly, regular JavaScript Errors are also seen in the browser JavaScript Console.
#### Composing Components:
- Component composition is one of the most powerful features of React.
- A component takes input (called properties) and its output is the rendere UI of the component.
- Things to remember when composing components:
    - Larger components should be split into fine-grained components when there is a logical separation possible between the fine-grained components.
    - When there is an opportunity for reuse, components can be built which take in different inputs from different callers.
    - React's philosophy preferse component composition over inheritance.
    - In general, remember to keep coupling between components to a minimum.
    - As mentioned earlier the use of a `React.Fragment` component is not reflected in the `DOM`. This can be useful for certain uses cases. The book provides an example of needing to return table rows.
#### Passing Data Using Properties:
- The way to switch to JavaScript syntax within any JSX snippet is to use curly braces`{}`, to encapuslate the JavaScript.
- The easiest way to pass data to child components is using an attribute (custom or otherwise) when instantiating a component.
- For a complete list of DOM elements and how HTML attributes need to be specified in JSX, see :
https://reactjs.org/docs/dom-elements.html
#### Passing Data Using Children:
- Just like regular HTML, React components can be nested. When React components are converted to HTML elment, the elments nest in the same order. React components can act like the `<div>` and take in nested elements. In such a case, the JSX expression will need to include both the opening and closing tags, with the *child* elements nested in them.
#### Dynamic Composition:
- This section replaces teh hard-coded set of `IssueRow` components with programattically generated set of components from an array of issues.
- The `map()` `Array` method is used to map an issue object to an `IssueRow` instance. A `for` loop can not be used instead of the `map()` method, because JSX is not a templating language. JSX only allows JavaScript expressions in the `{}` (curly brackets).
- Every instance of `IssueRow` needed to be identified with an attribute called `key`. React uses the `key` to optimize the calculation of difference when things, change, e.g. a new row is inserted. Here we end up using `ID` of each issue as the `key`, since each unquely identifies the row.
- React does not automatically call `toString()` on objects that are to be displayed, therefore objects (in this case a `Date`) need to be explicitly converted to strings.

### Errors & Issues:
- Listing 3-6 is missing an opening single quote for  `New` in and should read `...status: 'New'`.
- In Listing 3-8, I accidentally did not initially change the `issues.map()` method contents. Specifically, i did not change `rowStyle` to `key`, within the `IssueRow` mapping, causing the browser to not render anything.


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
