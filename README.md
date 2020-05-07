# StefanHristov-Book  
Work through Pro MERN Stack 2nd Ed
---
## Chapter 2
### Summary:

### Chapter 2 Notes & Errors:

- React is a Javascript file that comes in two parts:
    1. The first is the React core module, the one responsible for dealing with React components, their state manipulation, etc.
    2. The second is teh ReactDOM module, which deals with converting React components to a DOM that the browser can understand.
 - Listing 2-1 should read  `ReactDOM.render(element, document.getElementByID('contents'));`. The listing has a typo and passs the argument `content` instead of `contents` inside the `getElementByID()` method. The typo causes the method to return `null` and not properly render *"Hello World"* becauseno element with that ID exists.
 - JSX (JavaScript XML) is a React markup language with similar syntax to HTML.
- Babel is used to compile JSX into regular JavaScript to be injected and used by the browser.

