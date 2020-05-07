# StefanHristov-Book  
Work through Pro MERN Stack 2nd Ed
---
## Chapter 2
### Summary:

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

### Errors:
 - Listing 2-1 should read  `ReactDOM.render(element, document.getElementByID('contents'));`. The listing has a typo and passs the argument `content` instead of `contents` inside the `getElementByID()` method. The typo causes the method to return `null` and not properly render *"Hello World"* becauseno element with that ID exists.
