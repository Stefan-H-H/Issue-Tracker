# StefanHristov-Book  
Work through Pro MERN Stack 2nd Ed
---
Work through *Pro MERN Stack* (2nd Ed.)

This is my repository for the project described in the book *Pro MERN Stack* (2nd Ed.) by Vasan Subramanian. Notes included are general notes that I thought would be beneficial for reference. Notes also include any errors or issues encountered while working throughout the book.

---
## Chapter 14
### Summary & Functionality Added:
Chapter 14 explores setting up authentication, session management, and restriction of application mutation based on authentication of the user. The Google Authentication API is used to allow users to login into our application directly with their Google account credentials. As such, users can view all information without signing in, but in order to make any change they have to sign in. Additionally, we make sure entire pages are rendered at the UI server even when they are authenticated pages.

![ch14](/readme_images/ch14.png)

### Chapter 14 Notes:
#### Sign-in UI
- Here we implement the user interface for signing in users.
- We create a `SignInNavItem` that we place in the `NavBar` of the `Page` to open a new modal prompting the user for Sign-in.
#### Google Sign-In:
- Here we integrate Google sign-in functionality for the user.
- We follow the  Guides provided by Google's `https://developers/google.com/identity/sign-in/web/sign-in` page to create a project and OAuth client ID.
- We need to customize the Sign-in Button to avoid the default handling of Google's sign-in integration.
#### Verifying the Google Token
- Here we ensure that the credentials are verified on the back-end.
- Validating a token at the back-end is required as a measure of security. That’s because the back-end cannot trust the UI to have done the authentication, as it is public and can also respond to any HTTP request, not just from the Issue Tracker UI.
- The client authentication library returns a token on successful authentication, which can be verified at the back-end using Google's authentication library for Node.js. We then send this token from the UI to the back-end for it to be verified.
- We send the Google token to the `signin` API. The token itself is obtained by a call to `googleUser.getAuthResponse().id_token`. The token is passed to the `sigin` API.
#### JSON Web Tokens:
- Here we utilize JSON Web Tokens to make the verified Google Token persist the information upon refresh and rerouting to other pages within the web application. 
- JSON Web Tokens (JWT) allow us to encode all the session information that needs to be stored in a token, and encrypt it, while also allowing us to add more variables, such as  a role identifier  that can be used to apply authorization rules.
- We establish a session that persists even across server restarts. We use HWT to generate a token and send it back to the browser. On every API call that the UI makes, the token needs to be included, identifying the signed-in user. We send the token across as a *cookie* to avoid XSS (cross-site scripting) vulnerabilities in the application, by setting an `HttpOnly` flag on the cookie. Using a cookie is the best method provided that the information is limited to 4KB and the UI and API servers are part of the same domain.
#### Signing Out
- Here we implement a Sign-Out API, in which we use the server to clear the JWT cookie in the browser and forget the Google authentication.
#### Authorization
- Typical enterprise applications will have roles and users belongings to roles. The roles will specify what operations are allowed for the user. Here we implement a simple authorization rule in which if a user is signed in, the user is allowed to make changes, otherwise unauthenticated users can only read issues.
- As such, we prevent any API under `mutation` from being accessed by unauthenticated users. The APIs will report an error when an unauthorized operation is attempted.
- The Apollo Server provides a mechanism by which a `context` can be passed through to all resolvers. The context holds the user information and is passed on to each resolver. If a user is not authenticated/signed in we throw an Authentication error, instead of executing an appropriate resolver.
#### Authorization-Aware UI
- In this section of the chapter, we make the UI aware of the signed-in status of the user and disable the Create Issue button in the navigation bar if the user is not signed-in.
- We convert `Page` to a regular component, instead of a previously stateless component.
- We consolidate the two separate methods for sign-in and sign-out into a single `onUserChange` method.
- The user signed-in state will reside in the `Page` component.
#### React Context
- In this section, we make the other components aware of the authentication status. Here we specifically disable the Close and Delete buttons in the IssueTable and disable the Submit button in the Edit page.
- We use the React Context API to pass properties across the component hierarchy without making intermediate components aware of it. The React Context is designed to share data that is to be considered global. 
- The created context exposes a component called `Provider` under it, which needs to be wrapped around any hierarchy that needs the context. The component takes in a prop called `value`, which needs to be set to the value that the context will be set to in all descendant components.
- We convert the `IssueRow` component to a regular (not stateless) component so that it may consume the  user context.
#### CORS with Credentials
- In this section we revert the application back to run in non-proxy mode by relaxing the CORS options while maintaining security.
- The reason CORS previously blocked the verification of the Google token from being sent to `auth/signin` was because the origin of the application was not the same as the target of any XHR call, deeming it unsafe. The starting page was fetched from `localhost:8000`, but the API calls are being made to `localhost:3000`.
- The default configuration of the Apollo Server enabled CORS and allowed requests to `/graphql`, but since it was not done on `/auth`, it was blocked.
- We use the `cors` package to enable CORS for the `/auth` set of routes. We then use a CORS configuration option called `credentials` which is set to `true` to allow the server to explicitly allow credentials to be sent.
- We change the Apollo Server CORS configuration options to allow GraphQL API calls.
#### Server Rendering with Credentials
- In this section we make changes to allow for server rendering with credentials.
#### Cookie Domain
- Cookies and CORS works slightly differently when it comes to cross-site requests. Whereas CORS recognizes even a port difference as a different origin, a cookie set by the server is tied to the *domain*, and all requests to the same domain from the browser will include the cookie. The cookie policy ignores differences in ports.
- In this section, we set up environment variables and configure the UI so that the API endpoint is based on `api.promerstack.com:3000` and then use `ui.promernstack.com:8000` to access the application.

### Errors & Issues:
- pg 474, `.env` file should be in `ui` directory, not `ui/server`.


## Chapter 13
### Summary & Functionality Added:
This chapter explores more advanced functionality. Functionality added includes:
- Refactoring Toasts to create a Higher Order Component for reuse via composition.
- Report page with a pivot table for issues
- Pagination of issues
- Undo functionality for issue deletion 
- Text-based search bar 

![ch13](/readme_images/ch13-1.png)

![ch13](/readme_images/ch13-2.png)

### Chapter 13 Notes:
#### Higher Order Component for Toast:
-  Here we create a new component called `ToastWrapper`  that wraps each main view to add the toast functionality. In doing so, we *compose* a wrapped component using `ToastWrapper` and any of the view components, e.g. `IssueList`.
- The pattern of creating a new component class from an existing component class and injecting into it additional functionality is called *Higher Order Component (HOC).*
#### MongoDB Aggregate:
- Here we explore what MongoDB provides in terms of getting summary data of a collection, that is, *aggregates*.
- We create a file called `generate_data.mong.js` which is a script that allows us to create randomized issues to populate the database with an additional 100 issues.
- MongoDB provides the collection method `aggregate()` to summarize and perform various other read tasks on the collection using a *pipeline*. A pipeline is a series of transforms on the collection before returning the result set.
- The final structure of the query will be used to help build the Report page looks like this:

` > db.issues.aggregate([
        { $match: { effort: { $gte: 4 } } },
        { $group: {
            _id: { owner: '$owner', status: '$status' },
            count: { $sum: 1 },
        } }
    ])`

    Where `match` stage acts as a filter for issues with an effort level of 4 or greater, and then the `group` stage identifies (`_id`) the grouping to be performed by owner and status and accumulate (`count`) the total amount of issues.
#### Issue Counts API:
-  Here we implement an Issue Counts API to make the aggregate query to MongoDB.
- To make the array that is returned more useful, we have one element per owner rather than one element for each owner-status combination, and one property each for the count of each status.
#### Report Page:
- Here we construct the UI for the Report Page.
- The report table is a cross-tab and/or pivot table, where the table has one axis labeled with the statuses and the other axis with owners.
- We modify `IssueFilter` component to use a `urlBase` instead of the previously hardcoded route `/issues` so that we can route the filter to either `IssueList` or `IssueReport`, both of which make use of the filter.
#### List API with Pagination:
- Here we modify the List API to support pagination.
- We modify the schema to add a count of pages in addition to the list of issues. So instead of returning the list of issues directly, we return an object that contains the list as well as a page count.
- In the API implementation, we use the parameter `page` to skip to a given page and limit the number of objects returned. The MongoDB cursor method `skip()` can be used to get the list of documents starting at an offset. Additionally, the `limit()` cursor method can be used to limit the output to a certain number.
- Whenever offsetting into a list, we need to ensure that the list is in the same order when queried multiple times. As such, to guarantee a certain order, we need to include a sort specification and use the ID as a key to sort on.
#### Pagination UI
- Here we use the newly modified List API to display a bar of pages. We create our own minimalistic pagination bar that shows pages in chunks of five.
- We modify the data fetcher in the `IssueList` component to include the total count of pages in the query and save it in the state.
- We also create a `PageLink` component to encode the currently active filter in addition to using `LinkContainer` to create the actual link for the page.
- We modify the z-index of our `Toast` component to be higher than the pagination bar, so that the toast messages do not get obscured by the pagination bar.
#### Pagination Performance:
-  The approach of using the same cursor to fetch the count is okay for small data sets, but it can't be used for larger data sets. The problem with a pagination that knows the number of pages is that it needs the total count of documents in the filtered set. As such, in any database, counting the number of matches is an expensive operation.
- If the amount of records are hundreds of pages long, it is unlikely that the user will want to go to exactly the 97th page. In such cases it's advisable to just show the Previous and Next Links and not query the total count in ever request.
- The ideal strategy to use with large sets is to return a value in the API's return that indicates where the next page starts, in terms of an indexed field value. For the Issue Tracker, The ID field is ideal for this. With this strategy, one wouldn't use the skip() operation, but would instead use the ID as a filter to start from, using the `$gte` operator. The database could then go directly to the document and traverse from thereon to fetch on page of documents.
#### Undo Delete API
- Here we implement the API required for an undo action for the delete operation. We change the graphql schema to have an `issueRestore`, modify `api/issue.js` to have a restore function that takes a deleted issue from the `deleted_issue` database collection and puts it back in the `issues` collection, and we tie the resolver to the API endpoint in the API handler.
#### Undo Delete UI
- We implement an Undo button (link) within the Toast message whenever a user deletes an issue. When the button is clicked it calls the Restore (Undo Delete) API.
#### Text Index API:
- Here we implement a Text Index API that acts not as a search filter, but as an autocomplete that finds all issues matching the words typed, and lets the user pick one of them to directly view.
- Because it wouldn't be performant to apply a filter criterion like a regex on all issues because MongoDB would have to scan all the document and apply the regex to see if it matches the search term, we instead use MongoDB's text index. MongoDB's text index lets you quickly get to all the documents that contain a certain term. A text index gathers all the terms (words) in all the documents and creates a lookup table that given a term (word), returns all documents containing that term (word).
#### Search Bar:
- Here we implement the UI for a Search Bar.
- Instead of implementing search components ourselves, we use **React Select** for our purpose. After the user types in a word, the results are fetched and shown in a dropdown, one of which can be selected.
- We create a `Search.jsx` file for a component that will display a React select and implement the methods required to fetch the documents using the new search filter fin the List API.
- React Select needs two callbacks tow show options: `loadOptions` and `filterOptions`. 
    - `loadOptions` is an asynchronous method that needs to return an array of options. Each option is an object with properties `label` and `value`, the `label` being what the user sees and the `value` being a unique identifier. We choose the issue ID to be the `value` and `label` is a combination of the ID and issue title.
    - `filterOption` is expected to be called for each of the returned options to determine whether or not to show the option in the dropdown. Here, wince the options that were retrieved using `loadOptions()` are already the matched ones, we just return `true` in the callback.
- On clicking an option from the dropdown, the user gets routed to the issues edit page.

### Errors & Issues:
- On page 436, the template string `'Lorem ipsum dolor sit amet, ${i}'` needs to be surrounded by backticks rather than single quotes: `Lorem ipsum dolor sit amet, ${i}`
- On page 467, the line history.push('/edit/${value}'); should use backticks instead of single quotes. The correct code is ``history.push(`/edit/${value}`);``

## Chapter 12
### Summary & Functionality Added:
This chapter explores server-side rendering. Server-side rendering generates the HTML on the server side and sends it to the browser to be rendered on the DOM. With server-side rendering the entire HTML is constructed on the server and sent to the browser. Th need for server-rendering arises for an application to be effectively indexed by search engines. In this chapter we create an additional *About* Page to explore server rendering and later extrapolate and make our entire web application have server-rending by the end of the chapter.

![ch12](/readme_images/ch12.png)

### Chapter 12 Notes:

- Server Rendering - The first time any page is opened in the application (typing URL or refreshing the browser), the entire page will be constructed and returned from the server.
- Browser Rendering - Once any page is loaded and the user navigates to another page, we'll make it work like a SPA. That is, only the API will be made and the DOM will be modified directly on the browser.
#### New Directory Structure:
- Here we create a new directory structure for the `UI`. All code under the `src` directory is meant to be compiled into a bundle and served to the browser. We create three sets of files:
    - All the shared files (all the React Components).
    - A set of files used to run the UI server using Express. This will import the shared React components for server rendering.
    - A starting point for the browser bundle, one that includes all the shared React components and can be sent to the browser to execute.
#### Basic Server Rendering:
- Previously, we used `ReactDOM.render()` method to render a React element into the DOM. The counterpart method that is to be used to create an HTML on the server side is `ReactDOMServer.renderToString()`.
- We create `template.js` to accept the contents of `<div>` and return the complete HTML.
#### Webpack for the Server:
- Webpack can be used for the server as well, and it can compile JSX on the fly. This also lets us consistently use the import/export paradigm in the UI server codebase.
- Many server-side Node packages such as Express are not compatible with Webpack. They import other packages dynamically, making it hard for Webpack to follow the dependency chain. As a result, we'll have to exclude the third-party libraries form the bundle and rely on `node_modules` t be present in the UI server's file system.
#### HMR for the Server:
- Webpack  for the server does simplify the compilation process, but in development mode we'd have to restart the server on every change. Instead, we'll only reload changes to modules on the shared folder. As for changes to `uiserver.js` itself, we expect these to be very few and far between, so we'll restart the server manually when this file is changed and use HMR for the rest of the code that it includes.
#### Server Router:
- On the server, React Router recommends that we use `StaticRouter` in place of  a `BrowserRouter`. Whereas the `BrowserRouter` looks at the browser's URL, the `StaticRouter` has to be supplied the URL. Based on this, the router will choose an appropriate component to render. `StaticRouter` takes a property called `location`, which is a *static* URL that the rest of the rendering will need. It also needs a property called `context`, whose purpose is not obvious right now, so let's just supply an empty object for it.
#### Hydrate:
- In order to attach even handlers, we have to include the source code and let React take control of the rendered page. the way to do this is by loading React and letting it render the page as it would have done during rendering using the `ReactDOM.render()`.
- React makes a distinction between rendering the DOM to replace a DOM element and attaching event handler to the server-rendered DOM. Changing `render()` to `hydrate()` causes event handler to be attached to all components and make the page viewable *and* interactive.
#### Data from API:
- The message in the About component should come directly from the API server. We need the API's return value to be available when the component is being rendered on the server. This means that we'll need to be able to make requests to the API server via graphQLFetch() from the server as well.
- We replace the `whatwg-fetch` module with `isomorphic-fetch` which can be used both on the browser as well as Node.js.
- We create a global store for all data that is needed for the hierarchy of components that need to be rendered. (`store.js`). With data available in the global store, we can now change the `About` component to read it off the global store to display the *real* API version.
#### Syncing Initial Data:
- There should not be a mismatch between what the browser renders and what the server renders. As such, we need to make the browser render identical to the server render. We need the data when the component is being rendered for the first time. The recommended way to do that is to pass the same initial data resulting from the API call to the browser in the form of a script and use that to initialize the global store. This way, when the component is being rendered, it will have the same data as the component that was rendered at the server.
#### Common Data Fetcher:
- Here we add a data fetcher in the `About` component that could be used to populate its message to take care of the case where it is mounted only on the browser. We add a `componentDidMount()` method in the `About` component.
#### Generated Routes:
- Here we fix mismatched errors that React is showing for the rest of the pages, and lay down the framework that deals with fetching data in a generic manner, and make it fetch data that is appropriate for the component that will actually be rendered within the page.
- The data required via API calls needs to be available before rendering is initiated on the server.
- We create a list of routable pages in a JavaScript array that we store in a file called `routes.js`.
#### Data Fetcher with Parameters:
- Here we make `IssueEdit` component render from the server with the data it requires prepopulated.
#### Data Fetcher with Search:
- Here we implement the data fetcher in the `IssueLIst` component. We pass the query string (React router calls this `search`) in addition to the `match` object to `fetchData()`.
#### Nested Components:
- React Router’s dynamic routing works great when navigating via links in the UI, it is inconvenient when it comes to server rendering, but it does not  easily deal with nested routes. As such, we can use the route specification for `IssueList` which includes an optional issue ID, and this component deals with the loading of the detail part too. This method has the following advantages:
    - The route specification remains simple and has only the top-level pages in a flat structure, without any hierarchy.
    - It gives us an opportunity to combine two API calls into one in the case where the Issue List is loaded with a selected issue.
#### Redirects
- A request to the home page `/`, returns a HTML from the server that contains an empty page. We need the server  to respond with a 301 Redirect so that the browser fetches `/issues` instead from the server. Ind doing so, we allow search engine bots also will get the same contents for a request to `/` as they get for `/issues`.


### Errors & Issues:
- In the changes between listing 12-33 and listing 12-39 the name of the variable `initialData` appears to have changed to `resultData`.  It should be `initialData`.
- In listing 12-31, the line import fetch from 'isomorphic-fetch' is not in boldface, but should be. This code must be added to your script.
- In listing 12- 45, I changed  `const result = await graphQLFetch(query, { id }, showError)` to `const result = await graphQLFetch(query, { id: parseInt(id, 10) , showError)`.

## Chapter 11
### Summary & Functionality Added:
In this chapter we reconfigured the UI style by using React-Bootstrap to make the web application look more professional and polished. Some of the additions included:
- Using `Glyphicons` for closing, editing, deleting an issue.
- A removal of the select link, and allowing the entire row to be selected to show the corresponding description.
- Implemented a more polished Navigation Bar in the Header and a reference to the author's GitHub repo in the Footer.
- Implemented a collapsible `Panel` for the IssueFilter at the top of the IssueList page.
- Toast messages were implemented to notify the user of informational messages, such as success or failure of attempted operations.
- Implemented the use of modal component to allow the user to add an Issue from any page.


![ch11](/readme_images/ch11.png)

### Chapter 11 Notes:

#### Bootstrap Installation:
- Here we install React-Bootstrap and Bootstrap to begin making our web application look better. React-Bootstrap contains  library of React components and has no CSS styles or themes itself. It requires Bootstrap stylesheet to be included in the application to use these components.
- Google Chrome allows us to emulate a real mobile device. the `Show Device Frame` option can be selected to show an emulation of the device with its corresponding screen size. `Shift key + click-drag` allows us to emulate pinch zoom on the mobile device.
- We create a symbolic link to the Bootstrap distribution under the `public` directory so we can use bootstrap directly instead of through a CDN.
#### Buttons:
- Here we replace the Apply and Reset buttons in the Issue Filter with Bootstrap buttons.
- `<Button>` components uses `bsStyle` property to make buttons look distinct.
- The `Glyphicon` component of React-Bootstrap allows us to use icons for buttons. We implement the use of these components for the edit, close, and delete actions.
- The `Tooltip` component is used to provide a useful description of the button on mouse hover.
#### Navigation Bar:
- Here we style the navigation links into a formal header navigation bar, and add a footer, both of which are visible on all pages.
- We use a `Navbar` component to wrap the entire navigation bar which consists of a `Nav` component that wraps individual `NavItems`.
- `NavDropdown` is a component that provides functionality for a dropdown menu, where each option is wrapped by  a `MenuItem` component.
- The `react-router-bootstrap` package provides a wrapper called `LinkContainer` which acts as the React Router's `NavLink`, and at the same time lets its children have their own rendering.
#### Panels:
- Here we implement the use of Bootstrap's `Panel` component to decorate the Filter section in the Issue List page. The `Panel` component is a way that allows us to show section separately using a border and an optional heading.
- We can make the `Panel.Body` collapsible by using the `collapsible` property.
- We wrap the page contents with a `Grid` component to add margins to the body of the page within `Page.jsx`.
#### Tables:
- Here we implement the use of a bootstrap table to make it look better, highlight a row on mouse hover, and have the table expand to the fit the screen.
- We also remove the select link, and make the entire row clickable so that the description is displayed. We do this by using a `LinkContainer` to wrap the entire row and let it navigate to the same location as in the `Select` link.
- To avoid selection behavior on the buttons within the row, we use `e.preventDefault()` for the buttons.
#### Forms:
- We are introduced to the basic components of the Bootstrap library to replace simple `<input>` and `<select>` options with the React-Bootstrap equivalents and labels for them.
- Using React-Bootstrap, the common input types are instantiated using a `FormControl`.
- The `componentClass` property can be used to change the default (`<input>`) to any other element type, e.g. `select`.
- A label can be associated with the form control using `ControlLabel` component. The only child of this component is the label text. To keep the label and control together, they need to be put together under a `FormGroup`.
- `InputGroup.Addon` component can be used to display inputs next to each other.
- We previously used a space character between two buttons. A better way is to do this and keep the buttons together is by using the `ButtonToolBar` component.
#### The Grid System:
- The gird system words this way: the horizontal space is divided into a maximum of 12 columns. A cell (using the component `Col`) can occupy one or more columns and a different number of columns at different screen widths. The cells wrap if there are more than 12 column-space cells in a row (`Row` component). A new row is required if there's a need to force a break in the flow of cells. 
- When it comes to forms, the best way to use the grid system is to have a single row and specify how many columns each form control (one cell) occupies at different screen widths.
- The fluid grid system is best compared to paragraphs and lines. Rows = paragraphs. A paragraph can contain multiple lines. As the paragraph width (screen width) reduces, it will need more lines. It's only when you want to break two sets of sentences (sets of cells) that you really need another paragraph (row).
#### Inline Forms:
- Sometimes we want the form controls next to each other, including labels. This is ideal for small forms with two or three inputs that can all fit on one line. and are closely related. 
- For inline forms, we need a `<Form>` with the `inline` property to wrap the form controls.
#### Horizontal Forms:
- Here we change the Issue Edit page to use a horizontal form. In a horizontal form the label appears to the left of the input, but each field appears one below the other.
-  For horizontal forms, we need a `<Form>` with the `horizontal` property.
#### Validation Alerts:
- Here we replace validation errors within the `IssueEdit` page to use the bootstrap `Alert` component. We also implement the ability to have the user dismiss, or exit out of the alert.
- The `Alert` component has different styles, e.g. `danger`, `warning`, etc.
#### Toasts:
- We replace all other result messages and informational alerts related to report successes and failures of operations with a `Toast` component modeled after functionality that exists in Android OS. Changes are made to `IssueDetail`, `IssueEdit`, and `IssueList`.
- We additionally implement a timer that can call the  `onDismiss()` callback when time expires. Our message with thus fade out after 5 seconds.
- Because the timer may fire event if the user has navigated away from the page, we implement a `componentWillUnmount()` method to dismiss the timer when the component is unmounted.
#### Modals:
- Here we replace the in-page `IssueAdd` component with a modal dialog that is launched by clicking the Create Issue navigation item in the header. This way a user can create an issue from anywhere in the application.
- We create a self-contained component that displays the navigation item, launches the dialog and controls its visibility , creates the issue, and routes to the IssueEdit page on successful creation. The new component is called `IssueAddNavItem`.
- The `Modal` component requires two important properties: `showing` which controls visibility of the modal dialog, and `onHide()` handler, which will be called when the user clicks on the cross icons to dismiss the dialog.
-`graphQLFetch` call errors handled and shown via a Toast message. 

### Errors & Issues:
- On page 333, in Listing 11-10, the author shows removal of `withRouter` import. It in fact needs to be retained. (Confirmed with author's repo).
- On page 354, the author states to define two methods to toggle the state of the validation message's visibility and bind them to `this` in the constructor, and to refer to Listing 11-19. Binding of these methods is not shown in Listing 11-19. (I referred to the author's repo).


## Chapter 10
### Summary & Functionality Added:
This chapter focused on further UI development for both the main `IssueList` page and the `IssueEdit` page. We implemented the following:
- A two field (min, max) number input filter for effort on the `IssueList` page.
- Created an `Apply` and `Reset` button that allows the user to apply a filter only on click, and will reset the filter to the previously chosen one prior to application, respectively.
- A close button that allows the user to directly close an issue from a row in the table.
- A delete button that allows the user to directly delete an issue form a row in the table and retains it temporarily in a `deleted_issues` database collection, for later possible retrieval.
- Created an Edit form  for the `IssueEdit` page.
- Created specialized components for `TextInput`, `DateInput`, and `NumInput`. `TextInput` to help handle `null` cases, `DateInput` to handle dates, and `NumInput` to handle numbers, all while allowing for validation status awareness to the user in real time.

![ch10](/readme_images/ch10-1.png)

![ch10](/readme_images/ch10-2.png)

### Chapter 10 Notes:


#### Controlled Components:
-  Here we make the `IssueFilter` component a controlled component.
-  To be able to show a value in the input, it has to be controlled by the parent via a state variable or props variable. This can be done by setting the value of the input to the state or props variable. Thus, the input will directly reflect that value, and the React Component that renders the form will also control what happens in that form on subsequent user input. This is called a *controlled component*.
#### Controlled Components in Forms:
- Here we Add an apply button with an apply handler.
- React does not perform support two-way binding as part of its library.
- We also add a Reset button which will show the original filter of the dropdown on Click.
- After implementation, the chosen filter from the dropdown is only applied when clicking on the Apply button.
#### More Filters:
- Here we add a filter on the Effort field. We add a minimum and maximum, both of which are optional and allow us to filter.
- The `effort` filter of the MongoDB filter has to be created only if either of the effort options are present and then the `$gte` and `$lte` options have to be set.
 #### Typed Input:
 - Here we change the UI to allow two inputs for the effort filter that will coincide with  `effortMax` and `effortMin`. We also add a filter that screens the user's keystrokes so that only numbers are accepted in these input fields.
 - Filters responsiveness by URL changes can be tested by typing e.g. `localhost:8000/issues?effortMax=6`.
 - We utilize regex to limit user input to only digits.
 - After successful implementation of the Typed filters for `effort`, the URL should reflect the application of the effort filter when applied, e.g. `http://localhost:8000/issues?status=New&effortMin=5&effortMax=10`.
 #### Edit Form:
 - Here we remove the previous placeholder for the Edit Form page, and create a complete form for the Edit page in `IssueEdit.jsx`.
 - `...` is a spread operator which is used to spread the values of the issue object as if they were all mentioned individually, like `{ id: prevState.issue.id, title: prevState.issue.title }` etc. This is a simpler way of copying a n object compared to `Object.assign()`. Then with the property `name` as the *value* of the variable name is used to override the properties that were expanded.
 #### Specialized Input Components:
 - Ideally, we want the form's state to store the fields in their natural data types.
 - We also want all of the data type conversions routines to be shared. 
 - Specialized Input components should take the approach of a disjoint state - where the component is a controlled one as long as the user is not editing the component and its only function is to display the current value. When the user starts editing, we make it an uncontrollable component.
 #### Number Input:
 - Here we create a specialized input component for number inputs to be used for the `effort` filed in the Edit page in place of a plain `<input>` element.
 #### Date Input:
 - Here we create a specialized input component for dates in which we have to wait until the user is done typing to evaluate the validity of the input.
 #### Text Input:
 - Here we create a specialized input component for text input. While seemingly unnecessary, it allows us to handle null checks.
 #### Update API:
 - Here we implement the API that allows us to save the edited issue to the database.
 - We have two options for implementing the Update API:
    - We can update one or more fields in the document, correlating to  the MongoDB `update` command with the use of the  `$set` operator, or;
    - We can replace the entire document with new values, correlating to the MongoDB `replace` command.
- Here it is best we use the `update` operation because the `created` field.
#### Updating an Issue:
- Here we implement the `HandleSubmit()` method to make the call to the API to save the change made by the user.
#### Updating a Field:
- Here we use the same API to update a single field rather than the entire issue object all at once. Here we specifically implement a `close` button in the `IssueList` table allows the user to directly mark any issue closed on Click of the button.
#### Delete API:
- Here we implement a Delete API for disposal of an issue.
- It is important to note that we cannot name a function `delete` because it is a reserved keyword in JavaScript. We can, however, name it as `remove()` and export the function with a name `delete`.
- We mimic computer file system behavior when a user deletes a file by creating a separate database collection called `deleted_issues` in which we can temporarily store deleted issues for later potential retrieval.
#### Deleting an Issue:
- Here we integrate the Delete API into the UI and add a button for deletion that can allows the user to delete an issue on Click.
 
### Errors & Issues:
- Within `ui/src/IssueEdit.jsx`,  from pg. 285 of the textbook I changed line 91 in `loadData()` from to state: `const data = await graphQLFetch(query, { id: parseInt(id, 10) });`, otherwise there is a parsing error. Reference Chapter 9 error for further commentary.
- The specialized component `DateInput.jsx` causes the correct validation behavior in Firefox, but not in Chrome.

## Chapter 9
### Summary & Functionality Added:
In this chapter we implemented client-side routing, with the ability to show different pages depending on links in a menu and navigation bar. These behaviors were implemented with the use of the React Router library. We also implemented a detailed description display whenever an issue is selected.


![ch09](/readme_images/ch9.png)

### Chapter 9 Notes:

#### Simple Routing:
- In this section of the chapter, we create two views, one for the existing issue list and another which serves as a placeholder for a report section.
- We using routing to make sure that the home page `"/"` redirects to the issue list.
- We split the application's main page into two sections: a header section containing a navigation bar with hyperlinks to different views, and a contents section, which will switch between the two views depending on the hyperlink selected. We utilize **React Router** package and its component `Route` to create the described behavior.
- `Redirect` component is used to redirect from home page to `/issues`.
- The `HashRouter` component is used to allow us to use in-page anchors to redirect URLs to the correct route.
#### Route Parameters:
- The URL's path and the route's path need not be a perfect match. Whatever follows the matched part in the URL is the *dynamic* part of the path, and it can be accessed as a variable in the routed component.
- All routed components are provided an object called `match` that contains the result of the match operation. This contains a field called `params` that holds the router parameter variables. Thus, to access the trailing portion of the URL's path containing the `id`, `match.params.id` could be used.
#### Query Parameters:
- Here we implement a simple filter based the status field so that the user can list only issues that have a particular status.
- The placeholder filter in `ui/src/IssueFilter.jsx` is replaced with three hyperlinks, one for All Issues, one for New Issues, and one for Assigned Issues.
- The query string needs to be handled by `IssueList` component as part of the `loadData()` function. The React Router also supplies as part of props, an object called `location` that includes the path (in the field `pathname`) and the query string (in the field `search`).
- `componentDidUpdate()` function is created in `ui/src/IssueList/jsx` to detect a change in the filter and reloading the data on a change.
#### Links:
- In this section of the chapter, we replace the previously used `href` links with `Link` components.
- The `Link` component is similar to `href`, but it has the following differences:
    - The paths in a `Link` are always absolute; it does not support relative paths.
    - The query string and the pathname can be supplied as separate properties to the `Link`.
    - A variation of `Link`, `NavLink` is capable of figuring out if the current `URL` matches the link and adds a class to the link to show it is active.
    - A `Link` works the same between different kinds of routers, that is, the different ways of specifying the route (using the # character, or using the path as is) are hidden from the programmer.
- `Link` takes one property `to`, which can be a string (for simple targets) or an object (for targets with query strings, etc.)
- `NavLink` only adds a class called `active` when the link matches the URL.
#### Programmatic Navigation:
- In this section of the chapter, we add a dropdown menu for filtering purposes, and set the query string based on the value of the dropdown.
- Query strings are typically used when the variables' values are dynamic and could have many combinations that cannot be predetermined.
- The React Router adds properties to `IssueList` component, one of which is `history`. Using this, the location, query string, etc. of the browser's URL can be set.
#### Nested Routes:
- A common pattern for displaying details of one object while displaying a list of objects is using the header-detail UI pattern. We implement this behavior in this section, by creating a detailed description for a selected issue.
- *Nested Routes* are where the beginning part of the path depicts one section of a page, and based on interaction within that page, the latter part of the path depicts variation, or further definition of what's shown additionally in the page. (e.g. `/issues` shows a list of issues and no detail, but `/issues/1` shows the detail section for issue 1 in addition of the list of issues.)
- This behavior can be easily implemented due to Reacts *dynamic routing* philosophy.
- `api/scripts/init.mongo.js` is modified to include descriptions for the existing issues so  we can use to verify appropriate behavior in the GraphQL playground and on the localhost.
#### Browser History Router:
- Up until this point, we used hash-based routing. But the downside of using has-based routing is when the server needs to respond to different URL paths.
- The need to respond differently to different routes from the server itself arises when we need to support responses to search engine crawlers. That's because, for every link found by the crawler, a new request is made provided the *base* URL is different. If what follows the `#` is different, the crawler assumes that it's just an anchor within the page, and only a request to `/` is made regardless of the route's path.
- To initialize changes, we change from `HashRouter` to `BrowserRouter` in the import statement of `ui/src/App.jsx`.
- We also change `ui/uiserver.js` to return `index.html` *any* URL that is not handled, otherwise we receive a `Cannot GET /issues` message on attempt to refresh.
- We also add a `publicPath` option to `ui/webpack.js` file to fetch update information for modules when they change and are recompiled by HMR.

### Errors & Issues:
- Had an issue when attempting to implement Nested Routes. I would consistently obtain the following error:

![ch09](/readme_images/ch9-error.png)

The error appears to be due to using an upgraded version of GraphQL, that does not match the author's repo. Author uses graphql `0.13.2` per the dependencies, as compared to the fact that I'm using `14.2.1`. Within `ui/src/IssueDetail.jsx`, I changed line 31 in `loadData()` from `const { match: { params: { id } } } = this.props;` to `const data = await graphQLFetch(query, { id: parseInt(id, 10) });` to address the issue.
- I had an issue when implementing the Browser History Router. I was not getting the proper refresh behavior for `localhost:8000/edit/1` and was receiving a syntax error when Webpack recompiled to generate the `app.bundle.js`. The source of the issue was that I had a typo in my `index.html` file and had missed a leading slash (`/`) for a script at the bottom of the page which now correctly reads: `<script src="/app.bundle.js"></script>`.


## Chapter 8
### Summary & Functionality Added:
No additional functionality was added in this chapter. The priority was to further modularize the existing code sourced from `App.jsx` into individual files for React components, and utilize Webpack to assist with bundling and compiling modules to assist with workflow for deployment.

![ch08](/readme_images/ch8.png)

### Chapter 8 Notes:

#### Back-End Modules:
- In this section of the chapter, the back-end functionality inside `api/server.js` is split into several files: `about.js`, `api_handler.js`, `db.js`, `graphql_date.js`, `issue.js`, and `server.js`.
- There are two key elements to interact with the module system: `require` and `exports`.
- The `require()` element is a function that can be used to import symbols from another module. The parameter passed to `require()` is the ID of the module. In Node's implementation, the ID is the name of the module. For packages installed using `npm`, this is the same as the name of the package and the same as the sub-directory where the package's files are installed. For modules within the same application, the ID is the path of the file that needs to be imported.
- As an example, to import symbols from another file called `other.js` in the same directory, the statement written is as follows: `const other = require('./other.js);` This way whatever is exported by `other.js` will be available in the `other` variable.
- The main symbol that a file or module exports must be set in a global variable called `module.exports` within that file, and that is the one that can be returned by the function call to `require()`.
#### Front-End Modules and Webpack:
- In this section of the chapter we install Webpack,  split App.jsx, and use Webpack to create a bundle for the Front-End modules.
- Webpack helps workflow by automating the transform and bundle process of JavaScript files that will be used by the browser.
- Web pack helps to put together multiple files into one or a few bundles of JavaScript that has all the required code that can be included in the HTML file.
- Webpack is installed as a developer dependency, because the UI server in production has no need for Webpack.
- Webpack uses ES2015 style imports like this: `import graphQLFetch from './graphQLFetch.js`.
- Webpack can automatically determine that a file depends on another due to an import statement and include all necessary files in the bundle.
#### Transform and Bundle:
- In this section of the chapter, we install **babel-loaders**, to help transformations of `.jsx` files, and split `App.jsx` into many files, where each file is a React component placed in its own file.
- All transforms and filetypes other than pure JavaScript require loaders in Webpack.
- To make configuration and options easier for webpack, a configuration file can be used instead of performing configuration via command line. The default file in which configuration and options are placed are in a file named `webpack.config.js`.
- Webpack has two modes, production and development, which change the kind of optimizations that are added during transformation.
- Best practice is that each React component be placed its own file, especially if the component is a stateful one.
- `App.jsx` imports `IssueList.jsx` which in turn imports the rest of the React components.
#### Libraries Bundle:
- In this section of the chapter, we take the previously fetched third-party libraries from a CDN, and instead load those dependencies using `npm`, bundle them using webpack, and optimize bundling so that two separate bundles are created, one for application `app.bundle.js` and one for all third-party libraries `vendor.bundle.js`.
- We exclude libraries from the transformation process by changing the `webpack.config.js` file to exclude the `node_modules` directory.
- We also utilize the `splitChunks` plugin to separate everything from `node_modules` into a separate bundle named `vendor.bundle.js`. Doing so, helps us remove unneeded transformation, and saves time and bandwidth.
#### Hot Module Replacement:
- In this section of the chapter, we install and utilize the Hot Module Replacement (HMR) feature from Webpack. The HMR feature changes modules in the browser while the application is running, removing the need to refresh the browser. It also saves time by updating only what is changed.
- We configure the `ui/uiserver.js` file to utilize enable HMR only when we are in development mode.
- The console will log `[HMR] connected` in the Developer Console to confirm HMR has been activated.
- We accepted all changes unconditionally at the top of the hierarchy of modules in `App.jsx` by invoking the HMR plugin's `accept()` method in `App.jsx`.
#### Debugging:
- In this section of the chapter, we changed enabled `devtool` configuration parameter in `webpack.config.js` so we can utilize a `source-map` to debug our source code when comparing it to the compiled code.
#### DefinePlugin: Build Configuration:
- Instead of injecting environment variables into the front-end using a generated script of `eng.js`, Webpack's `DefinePlugin` can be used and configured in the `webpack.config.js` file instead to add and define a predetermined string. This approach works well, but has the downside of having to create different bundles or builds for different environments. As such, it is not a method utilized in the book.
#### Production Optimization:
- Two concerns that remain when the output is specified for production:
- *bundle size*: For our Issue Tracking application, we make the assumption that it is a frequently used application, so the browser caches the bundle and the bundle size is not a concern. A strategy called *lazy-loading* can be utilized if bundle-size is a concern, which prioritizes splitting bundles into smaller sizes and loading bundles when required.
- *browser caching*: Most modern browsers handle browser caching well and will check if there are changes within bundles. *content hashes* can be used as part of the bundle's name to force a bundle change.


### Errors & Issues:
- No issues.
- Listing 8-29, is missing a comma after `devtool: 'source-map'`.



## Chapter 7
### Summary & Functionality Added:
This chapter is centered around making changes that improve overall scalability of the project and workflow by focusing on changing the overall architecture of the project and implementing the use of ESLint to enforce good and consistent code style. No new application functionality was added in this chapter. That said, we changed the architecture of the project, by splitting the one (1) original server into two (2) -- an API Server, and a separate UI Server, each responsible for their own functions. Additionally, ESLint is used to add checks and for  adhering to coding standards, best practices, and validations.

![ch07](/readme_images/ch7-api.png)
![ch07](/readme_images/ch7-ui.png)

### Chapter 7 Notes:

#### UI Server:
- To date, the Express server was serving static content, but also served API calls.
- In this section, directories and file names were reconfigured such that the two functions previously performed by one server is split out and performed by two servers. One server that serves static content (**UI Server**), and one that hosts just the API (**API Server**).
- For development purposes, we run the UI and API Servers on the same computer, but on different ports. The ports are as follows:
    - API Server: port 3000
    - UI Server: port 8000
- The API server will now be responsible for handling only the API requests and respond only to URLs matching `/graphql` in the path.
- The UI Server will now be responsible for contain the static middleware and serve all static content.
#### Multiple Environments:
- In this section rather than predetermine the ports and MongoDB URL based on possible deployment targets such as development, staging, production, we keep the variables flexible so that they can be set to anything at run time.
- We utilize a `dotenv` package to allow us to set up a configuration `.env` file for both the UI and API Servers. The package allows us to convert variables stored in a configuration file into environment variables. This way, in our code, we only deal with environmental variables, allowing us the flexibility of having the environment variables be supplied via real environment variables or via a configuration file.
- It is recommended that `.env` file not be checked into any repository.
-Note that the actual environment variables take precedence over (or override) the same variable defined in the `.env` file.
#### Proxy-Based Architecture:
- Per the Network tab of the Developer console, we see that two calls to `/graphql` are made instead of one. The reason is that the API call is to a host (`http://localhost:3000)` that is different from the origin of the application (`http://localhost:8000`).
- Due to the same-origin policy, requests like this are normally blocked by the browser unless the server specifically allows it.
- This mechanism is called *cross-origin resource sharing* or **CORS** for short.
- Typically, CORS is disabled to protect against malicious attacks.
- For exploration purposes, we run `npm install http-proxy-middleware@0` in the UI server directory and make a few file changes to the `uiserver.js` and `.env` files. In doing so, we create a proxy such that the UI Server routes uses a proxy to route any requests to `graphql` to the API Server allowing us an alternate way to make API calls.
- For the sake of following the book, proxy changes were reverted so that **direct API call mechanism** can be used.
#### ESLint:
- Here we install and configure ESLint to help our workflow and help us and our code adhere to conventions, standards and good practices. ESLint is a linter that allows us to define rules we want to follow. 
- We extend from the base configuration and rule sets defined by the **Airbnb** style guide/configuration. In the `api` directory, since we are only working on the back-end code only, we only  set up the  base configuration from Airbnb for plain JavaScript.
- We create an `.eslintrc` file (JSON specification) in the `api` directory which acts as a specification for which rules need to be enabled or disabled. By using the .`eslintrc` file, we make the rules apply to all files in the directory. In order to override rules in a single file, rules can be specified within comments in that file.
- We create a script in the `package.json` file so that we  may run `npm run lint` at the command line to run ESLint and check for errors/warnings that will be displayed at the command line.
#### ESLint for the Front-End:
- Here we install and configure ESLint for the `ui` directory like was done for the back-end (`api` directory), but we also include the complete **Airbnb** configuration, which includes the React plugin.
- We exclude the `public` directory from linting because it includes a compiled `App.js` and would result in many errors. The following command is issued to include multiple extensions (`--ext`) and ignore the `public` directory (`--ignore-pattern`):
    - `$ npx eslint . --ext js,jsx --ignore-pattern public`
- We  also create a script in the `package.json` file so that we  may run `npm run lint` at the command line to run ESLint and check for errors/warnings that will be displayed at the command line.
#### React PropTypes:
- Similar to Java which is strongly-typed and provides type validation, the properties being passed from one component to another component can also be validated against a specification.
- The specification can be supplied in the form of a static object called `propTypes` in the class, with the name of the property as the key and the validator as the value.
-  Use case examples and documentation for PropTypes shown here [https://www.npmjs.com/package/prop-types].

### Errors & Issues:
- Upon migrating files to an independent `api` directory as specified on page 175-176 of the textbook,  the API Server would consistently crash and not work properly. As such, the `package.json` file was changed such that the graphql version was changed from `0.13.2` to `14.2.1`. `npm install` was ran again after making the change, and the API server became operational.
- On page 178-181 of the textbook, the author's figures reference the environmental variable configuration file name as `sample.env`. The author's online repository declares the environmental configuration file name as `sample.env`. **This is not correct!** The files should be named simply `.env` in order for `nodemon` to be able to properly watch these configuration files, and properly import and set the defined import variables.


## Chapter 6
### Summary & Functionality Added:
In this chapter we performed a local installation of MongoDB and `mongo` shell to interact with a MongoDB server. The purpose of this chapter is to replace the previous array of issues in the Express server's memory that was previously used as the database, and instead use a MongoDB database to implement read and write functionality to and from the issues list from the MongoDB database.

**A Few Notes for MongoDB & Mongo Shell**:
- To *start* and run MongoDB as a MacOS service, issue the following command at the command line:

`brew services start mongodb-community@4.2`
- To *stop* the `mongod` process running as a macOS service, issue the following command:

`brew services stop mongodb-community@4.2`
- To verify that MongoDB is running, search `mongod` in your running processes at the command line:

`ps aux | grep -v grep | grep mongod`
- To *begin* using MongoDB, connect a mongo shell to the running instance. Issue the following to start the mongo shell:

`mongo`
- To *stop* the mongo shell, a keyboard interrupt `Ctrl+C` can be used.


![ch06](/readme_images/ch6.png)

### Chapter 6 Notes:

#### MongoDB Basics:
- MongoDB is a *document* database, which means that the equivalent of a record is a document, or an object.
- A document is a data structure composed of field and value pairs. The values of fields may include objects, arrays, arrays of objects, etc., as deeply nested as need be.
- MongoDB document has support not only for primitive data type (boolean, numbers, and string), but also for common data types such as dates, timestamps, regular expressions, and binary data.
- A *collection* is like a table in a relational database: it is a set of documents.
- A primary key is mandated in MongoDB, and it has a reserved field name `_id`. If the `_id` field is not supplied when creating a document, MongoDB creates this field and auto-generates a unique key for every document. Most often, the auto-generated ID can be used. MongoDB uses a special data type called the `ObjectId` for the primary key.
- The MongoDB query language is made up of *methods* to achieve various operations. All methods operate on a collection and take parameters as JavaScript objects that specify the details of the operation. For querying, the parameters are a query filter and a list of fields to return - called a **projection**.
- Installed MongoDB on my computer by following instructions posted here: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
- **Mongo Shell**:
    - The mongo shell is an interactive JavaScript shell, similar to the Node.js shell.
    - mongo shell documentation can be accessed at: https://docs.mongodb.com/manual/mongo
    - `show databases` - a command that will show the current available databases and the storage occupied by them.
    - `db` - a command used to identify the current database in use.
    - `show collections` - a command used to see what collections exist in the database in use.
    - `use <name>` - a command used to switch to a new database called `<name>` instead of the default database.
    - `db.<collection>.insertOne()` - a method to insert a new document in the named `<collection>` . A collection is referenced as a property of the global `db` object. E.g. - The collection called `employees` can be referred to as `db.employees`.
    - `db.<collection>.find()` method when used without any arguments lists all the documents in the collection, but it is not displayed in readable-friendly way. Appending the `.pretty()` method on the end will format the output in a more legible manner. The `find()` method returns a `cursor` object that may be iterated over.
    - While Node.js uses the `console.log()` method for printing objects to the console, the mongo shell uses `print()` for the same purpose, but only prints strings. Objects either need to be converted to strings before printing using `tojson()` or use another method called `printjson()`, which prints objects as JSON.
#### MongoDB CRUD Operations:
- `db.<collection>.drop()` -  a convenient method that a collect object can use to erase itself.
- **Create**:
    - If one attempts to insert a document with an `_id` already in use, a `WriteError` will result  due to a duplicate key.
    - The `_id` field is a primary key and is expected to be unique, regardless of whether it is auto-generated or supplied in the document.
    - It is best to let MongoDB auto-generate the `_id`.
    - The `db.<collection>.insertMany()` method can be used to insert multiple documents in a single command.
- **Read**:
    - the `find()` method two arguments that allows us to retrieve a subset of documents instead of a full list. The first argument is a filter to apply to the list of documents, and the second is a projection ( a specification of which fields to retrieve). The *filter* is an object where the property name is the field to filter on, and the value is the value that it needs to match. e.g. `{id: { $eq: 1} }`. General format of a single element in the filter is `fieldname: { operator: value }`. If multiple fields are specified, then all have to match (equivalent to *and* operation).
    - The `createIndex()` method is used wanting to create an index on a particular field. It takes an argument specifying the fields that form the index. The second argument to `createIndex()` is an object that contains various attributes of the index, one of them specifying whether the index is unique.
- **Projection**:
    - A projection specifies which fields to include or exclude in the result. The format of this specification is an object with one or more field names as the key and the values 0 or 1, to indicate inclusion or exclusion. The `_id` field is an exception, it is always included unless you specify a 0. e.g. `db.employees.find({}, { _id: 0, 'name.first': 1, age: 1})`
- **Update**:
    - There are two methods, `updateOne()` and `updateMany()` typically used for modifying a document. `updateOne()` stops after finding and updating the first matching document.
    - The update specification is an object with a series of `$set` properties whose values indicate another object, which specifies the field and its new value. e.g. `db.employees.updateOne({ id: 2}, { $set: {age: 23 } })`.
    - The `updateMany()` method has the same format as `updateOne()` but the effect is to **all** documents that match will be modified.
    - There is a method called `replaceOne()`, which instead of modifying a document, it replaces the existing document with a new one. The `_id` field is not modified as a result of the replacement.
- **Delete**:
    - `deleteOne()` and `deleteMany()` can be both used to remove document(s) from the collection. The method takes a filter and deletes the matching document.
    - The `count()` method on a collection can tell us how many documents it contains.
- **Aggregate**:
    - The `aggregate()` method can be used to provide a summary or an aggregation based on the documents in a collection.
    - The `aggregate()` method operates as a pipeline. Every stage of the pipeline takes the input from the result of the previous stage and operates per its specification to result in a new modified set of documents.
    - Here's an example of an aggregate that aggregates the total age for different organizations: 
    `> db.employees.aggregate([ 
    {$group: {_id: '$organization', total_age: {$sum: '$age' } } }
    ])`
#### MongoDB Node.js Driver:
- `npm install mongodb@3` was run to install and use a low-level driver. This is the Node.js driver that allows one to connect and interact with the MongoDB Server.
- A file `trymongo.js` was created to play around with different methods and interact with the MongoDB server.
- A URL identifies which database to connect to and the `connect()` method is used to connect make a connection to the database server.
- The `connect()` method is an asynchronous method and needs a call back to receive the result of the connection.
- `client.close()` is a method se to close the connection when things are finished. If this method is not executed, the Node.js program will not exit, because the connection object is waiting to be used and listening to a socket.
- Instead of using a callback paradigm, due to improvements in ES2017 and Node.js version 7.6, there is full support for the async/await paradigm to be used and is recommended. By using the async/await paradigm, all asynchronous calls with callbacks can be replaced with a call to the same method, but without supplying a callback. Using `await` before the method call will simulate a synchronous call by *waiting* for the call to complete and return the results. It makes things much easier to read and follow.
#### Schema Initialization:
- The mongo shell is an interactive shell and also a scripting environment.
- Here we create `init.mongo.js` which serves as a schema initialization script in the `script` directory.
- If at any point we wish to reset the database to a pristine state, the command `mongo issuetracker scripts/init.mongo.js` can be run at the command line from the bash terminal.
#### Reading From MongoDB:
- Here we change the List API to read from the MongoDB database rather than the in-memory array of issues in the server.
- The application is to maintain a connection with the MongoDB server so we can reuse it perform many operations, triggered from within API calls.
- The connection object is in fact a connection pool. It automatically determines the best thing to do: reuse an existing TCP connection, reestablish a new connection when the connection is broken, tec. Using a global variable (at least reusing the connection object) is recommended usage.
#### Writing to MongoDB:
- Here we change the Create API to create issues that use the MongoDB database to persist newly created issues.
- A `counter` collection is used to store a current count of issues that can be used to generate unique `id` fields at the time of creation of a new issue by using the `findOneAndUpdate()` method.

### Errors & Issues:
- Received a `DeprecationWarning` whenever running the MongoDB server.  I enabled the `useUnifiedTopology` flag in the MongoClient Constructor to remove the deprecation warning.


## Chapter 5
### Summary & Functionality Added:
This chapter introduced more specifics of handling server-side requests. The author speaks at greater detail about Express as the web server frame work built on top of Node, and GraphQL as a query language used to describe requests from a web client to a web server. It is used to load data from a server to a client.

At the conclusion of the chapter the following functionality is added to the Issue Tracker application:
- Using GraphQL a Create Issue API was implemented and integrated to that new issues could be added to the list of issues with an automated 10-day buffer for the due date.
- Input validations to the Issue Tracker were also added that would display to the user in the form of an `alert`. The following validations were performed:
    1. Field title must be at least 3 characters long.
    2. Field owner is required to be filled in if the status is "Assigned"
    3. validate date strings on their way in.
    
    ![ch05](/readme_images/ch5.png)

### Chapter 5 Notes:
#### Express:
- **Routing** - At the heart of Express is a router, which takes a client request, matches it against any routes that are present, and executes the handler function that is associated with that route. The handler function is expected to generate the appropriate response. 
    -  A route specification consists of:
        - An HTTP method(GET, POST, etc.).
        - a path specification that matches the request URI
        - and the route handler
        - Instead of `app.use()`, `app.get()` has to be used in order to match the GET HTTP method.
- **Request Matching** - When a request is received, the first thing that Express does is match the request to one of the routes. The request method is matched against the route's method.
- **Route Parameters** - Route parameters are named segments in the path specification that match a part of the URL. If a match occurs, the value in that part of the URL is supplied as a variable in the request object. Note that the query string is not part of the path specification, so you cannot have different handlers for different parameters or values of the query string.
- **Route Lookup** - The router does not try to find a best match, it tries to match all routes *in the order* in which they are installed, and the first match is used. This means that the routes should be defined in the order of priority. Typically, you should be careful to add the more generic pattern after the specific paths in case a request can match both.
- **Handle Function** - Once a route is matched, the handler function is called. The parameters passed to the handler are a request object and a response object.
- **Request Object** - Any aspect of the request can be inspected using the request objects properties and methods.
- **Response Object** - The response object is used to construct and send a response. Note that if no response is sent, the client waits indefinitely.
- **Middleware** - An *Express* application is a series of middleware function calls. Middleware functions are those that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. `express.static()` is the only built-in middleware (other than the router) available as part of *Express*. Third-party middleware is available via `npm`.
#### REST API:
- REST is short for **Representational State Transfer**, and is an architectural pattern for application programming interfaces (APIs).
- The APIs are resource based (instead of action based). Resources are accessed based on a Uniform Resource Identifier (URI), known as an endpoint. As such, resources are nouns, not verbs.
- In a REST API, to access an manipulate the resources, on uses HTTP methods. While resources were nouns, the HTTP methods are the verbs that operate on them.
- REST APIs have a few issues laid out on **pg. 90**. The author states that given these issues, most REST API implementations are more REST-*like*, rather than strict REST.
#### GraphQL:
- In GraphQL, the properties of an object that need to be returned **must** be specified.
- GraphQL API servers have a *single* endpoint in contrast to one endpoint per resource in REST. This makes it possible to use a single query for *all* the date that is required by the client.
- GraphQL is a strongly typed language. All fields and argument have a type against which both queries and results can be validated and give descriptive error message. The advantage of a strongly typed system is that it prevents errors.
- For JavaScript on the back-end, there is a reference implementation of Graph QL called GraphQL.js. To tie this to *Express* and enable HTTP requests to be the transport mechanism for API calls, there is a package called `express-graphql`.
#### The About API:
- Here we create a demo API called about that simply returns a String.
- The GraphQL schema language requires us to define each type using the `type` keyword followed by the name of the type, followed by its specification within curly braces.
- GraphQL schema has two special types that are entry points into the type system, called `Query` and `Mutation`. `Query` fields are expected to return *existing state*, whereas `Mutation` fields are expected to change something in the application's data. Note that query fields are executed in parallel, and mutation fields are executed in series.
- Best practice to implement READ operation under `Query` and things that modify the system under `Mutation.`
- GraphQL type system supports the following basic data types:
    - `Int`: Signed 32-bit integer.
    - `Float`: A signed double-precision floating-point value.
    - `String`: A UTF-8 character sequence.
    - `Boolean`: `true` or `false`.
    - `ID`: This represents a unique identifier, serialized as a string. Using an `ID` instead of a string indicates that it is not intended to be human-readable.
- The Schema Language has a provision to indicate whether a value is optional or mandatory. By default, all values are optional. All those that require a value are defined by adding an exclamation character (`!`) after the type.
- `resolvers` are function are "handler" functions that are called when fields are accessed. They resolve a query to a field with real values.
- All resolver functions are supplied four arguments like this:
    `fieldName(obj, args, context, info)`
    see **pg. 95** for description of each argument.
- The tool called *Playground* is available by default as part of the Apollo Server and can be accessed by simply browsing the API endpoint. This allows developers to explore the API with a Playground UI.
- In the GraphQL Playground, the query language has to be used to write a query on the left hand side of the window. It is JSON-like, but it is not JSON. The Playground queries the schema from the server when the "play" button is hit. Results are shown on the right hand side.
#### GraphQL Schema File
- Here we move the schema definitions out of `server.js` and into their own file `schema.graphql`.
- we read the typdefs from `schema.grahql` into the `server.js` file using the `fs` module and the `readFileSync` function.
- Lastly, we modify the `package.json` file to make sure the script for `npm start` watches changes to any `.graphql` files, using the `-e` option for `nodemon`.
#### The List API:
- Here we implement an API to fetch a list of issues.
- The GraphQL way to specify a list of another type is to enclose it within square brackets.
#### List API Integration:
- Here we replace the `loadData()` method in `IssueList` React component with an `async` method that constructs a GraphQL query to fetch data from the server.
#### Custom Scalar Types:
- JSON does not have a `Date` type, thus transferring data using JSON in API calls also must convert the date to and from strings.
- To be able to use a custom scalar type, the following has to be done:
    1. Define a type for the scalar using the `scalar` keyword instead of the `type` keyword in the schema.
    2. Add  top-level resolver for all scalar types, which handles both serialization (on the way out) as well as parsing (on the way in) via class methods.
- The class method `serialize()` is will be called to convert a date value to a string.
- A *reviver* function is used in `App.jsx` to convert the string to the native `Date` type. The `reviver` function is passed to the JSON `parse()` function. A reviver function is one that is called for parsing all values, and the JSON parser gives it a chance to modify what the default parser will do.
#### The Create API:
- Here we implement an API for creating a new issue in the server, which will be appended to the list of issues in the server's memory.
- input types require a separate schema definition in GraphQL. The `input` keyword is used for defining input types.
- `""` Double quotes are used for documentation purposes that are shown as part of the schema explorer. In order for the documentation to appear in the schema explorer, the String must be a comment above a field within the `.graphql` file.
- It is typically good practice to return values generated at the server.
- Since `IssueInputs` does have a `GraphQLDate` type, parsers for receiving date values must be implemented. Specifically, `parseValue` and `parseLiteral`.
- `parseLiteral` is called in the case where the field is specified in-place in the query. The method is called with an argument `ast` which contains a `kind` property and a `value` property. The `kind` property indicates the type of token the parser found (float, integer, or string).
- A return value of `undefined` indicates to GraphQL library that the type could not be converted, and it will be treated as an error.
- A default value can be defined in schema by adding an `=` sign and the default value after the type specification. e.g. `status: String = "New"`.
### Create API Integration:
- Here we fully integrate the functionality of adding an issue to our issue list and implement a change in the `handleSubmit()` method for class IssueAdd so that a due date 10 days from today automatically gets generated.
#### Query Variables:
- Here we modify the asynchronous `createIssue()` within `IssueList` to utilize query variables, instead of using a string template, to address the previous problem on not being able to take `""` within the `title` field of the issueAdd form.
- GraphQL has a first-class way to factor dynamic values out of the query and pass them as a separate dictionary. These values are called *variables*.
- To use variables, the operation must first be named after the `mutation` or `query` field specification. The input value has to be replaced with a variable name. Variables start with a `$` character, e.g. `$message`.
- GraphQL specification allows multiple operations to be present in the same query string. Button only one of these can be execute in one call. The value of `operationName` specifies which of those operations needs to be executed.
#### Input Validations:
- Here we add the following input validations to the Issue Tracker:
    1. Field title must be at least 3 characters long.
    2. Field owner is required to be filled in if the status is "Assigned"
    3. validate date strings on their way in.
- We define an enum schema for `status`, which will allow us to have predefined values from a dropdown menu. Note that JavaScript does not have enum types, so the values will be dealt with as strings, both in the client as well as the server.
- The Apollo Server recommends using the `UserInputError` class to generate user errors.
- The Apollo Server has a configuration called `formatError` that can be used to make changes to the way an error is sent back to the caller. We use this option to print out any errors to the console for debugging/development purposes.
#### Displaying Errors:
- Here we modify the user interface to show any error messages to the user. We deal with transport errors due to network connection problems and invalid user input.
- We create an asynchronous utility function called `graphQLFetch()` to handle all API calls and report errors.
### Errors & Issues:
- Initial setup of ApolloSever was repeatedly unsuccessful from **pg. 97**. After checking my work repeatedly, and running `npm  start`, I kept receiving an error that read as follows: `Error: Cannot find module 'graphql/validation/rules/PossibleTypeExtensions'`. After cross referencing the author's repo I noted that his dependencies for `apollo-server-express` were set to version `2.3.1`, whereas mine were only at `2.13.1`. I ran `npm install graphql@0 apollo-server-express@2.3` to force install the apollo server dependency to version `2.3+` instead, which solved the problem. 
- In `server.js` I accidentally did not correctly implement the `validateIssue()` function. For the last check:
    `if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', {errors});
    }`
    I did not wrap `errors` with `{}`. This later caused issues because when testing to see if Errors were properly displayed with `alert()` in `graphQLFetch()` in `App.jsx`, errors were not being properly displayed.
- The function shown as `validateIssue(_, { issue })` on the bottom of page 123 and on page 125 is incorrectly named and has the wrong parameters. It should be `issueValidate(issue)` as called at the top of page 126.



## Chapter 4
### Summary & Functionality Added:
This chapter explores how React handles model information using **state** and **properties**. This chapter walkthrough allows us to add the functionality of being able to add and create new issues interactively via a form with a submission button.

![ch04](/readme_images/ch4.png)

### Chapter 4 Notes:
#### Initial State:
- The state of a `component` is captured in a variable called `this.state` in the component's class, and should be an object of one or more key-value pairs. Each key is a state variable name and the value is the current value of the variable. It is useful to store anything that affects the rendered view and can change due to any event in the **state**.
#### Async State Initialization:
- It is unlikely that regular SPA (Single Page Application) components will have the initial state available to them statically. They are typical fetched form the server. For our initial list of issues, to be displayed, they would need to be fetched via an API call.
- The **state** can only be assigned a value in the constructor. After, the **state** can be modified, but only via a call to `React.Component`'s `this.setState()` method. The method takes a single argument ,which is an object containing the changed state variables and their corresponding values.
- Here a `setTimeout()` method call is used to simulate an asynchronous call to the server.
- The `constructor()` for the `IssueTable` class only constructs the *component*, it does not render the UI. As such, if the `this.setState()` method gets called before the component is ready to be rendered, errors occur.
#### Updating State:
- Added a `createIssue()` method to the `IssueTable` class to add a new issue. This allows us to change a portion of the **state**.
- The variable `this.state` in the component should always be treated as immutable.
- The only way to let React know something has changed, and to cause a re-render, is to call `this.setState()`.
- The `setState()` method needs a copy of the unchanged elements and a copy of the object that is being changed. There are libraries called *immutability helpers* such as `immutable.js` `(http://facebook.github.io/immutable-js/)`, which can be used to construct the new state object. *(See pg. 66).*
- React automatically propagates any changes to child components that depend on the parent component's state.
- When `render()` is called, this does not mean that the `DOM` is updated. Only the `virtual DOM` is recreated on each `render()`. Real `DOM` updates happens where there are differences.
#### Lifting State Up:
- Only parent components can pass information down to children. The way around this is to have the *common parent* contain the state and all the methods that deal with this state.
- Data can be passed in from a parent to child in the form of `props`.
- In ES2015, the arrow function has the effect of setting the context (the value of `this`) to the *lexical scope*. In order to have the proper scope when passing method data down to a child, the `bind()` method can be used to bind the method scope reference to the parent before passing the method to the child. It's best practice to bind the specified method within the constructor of the parent class.
#### Event Handling:
- Here we create a form with two text input fields and a button to allow a user to add an issue interactively.
- In order to prevent a form from being submitted when the **Add** button is clicked, we can call `preventDefault()` function on the event.
- `documents.forms.issueAdd` allows us to save the form and its contents to a variable, which we can then access to create a new issue using the `createIssue()` method via `this.props.createIssue()`.
- The `value` property (e.g. `form.owner.value`) allows us to obtain the user input value from the `DOM` element.
- Once a new issue has been added, in order for the changes to persist, we either need to save the change in local storage on the browser or save it in the server.
- The default action of a `form` is to a `GET HTTP` request with the values in the form.
#### Stateless Components:
- For performance reasons and for clarity of code, it is recommended that components with nothing but a `render()` method, aka *Stateless Components* are written as functions rather than classes. The functions would simply take in `props` and render based on it.
#### Designing Components:
| Attribute   | State                                  | Props                                                       |
|-------------|----------------------------------------|-------------------------------------------------------------|
| Mutability  | Can be changed using `this.setState()` | Cannot be changed                                           |
| Ownership   | Belongs to the component               | Belongs to an ancestor, the component gets a read-only copy |
| Information | Model information                      | Model information                                           |
| Affects     | Rendering of the component             | Rendering of the component                                  |

### Errors & Issues:
- No errors or issues.


## Chapter 3
### Summary & Functionality Added:
The purpose of this chapter was to introduce React components, and to use composition for composing larger elements. The functionality added during this chapter included using React classes instead of elements to depict components, and using `map()` to generate components based on an array of input data. The generated components are placeholders thus far for some components yet to be developed, but provided a skeleton structure for the main page of the Issue Tracker application.

![ch03](/readme_images/ch3.png)

### Chapter 3 Notes:

#### React Classes:
- React classes are created by extending `React`. `Component`, the base class from which all custom classes must be derived. With the class definition, at minimum a `render()` method is needed. This method is what React calls to display the component in the UI. `render()` must be provided otherwise the component will have no screen presence. The `render()` function is supposed to return an element( either native HTML or another React component).
- Since `render()` returns only a single element, if one wants to return multiple, then there are two options:
    1. Create a single `<div>` element that encloses the other elements; or
    2. Return a `React.Fragment` component that encloses the other elements. The `Fragment` component is like an enclosing `<div>` but has no effect on the `DOM`.
- Run time errors for the React library can be seen in the browser JavaScript Console. Similarly, regular JavaScript Errors are also seen in the browser JavaScript Console.
#### Composing Components:
- Component composition is one of the most powerful features of React.
- A component takes input (called properties) and its output is the rendered UI of the component.
- Things to remember when composing components:
    - Larger components should be split into fine-grained components when there is a logical separation possible between the fine-grained components.
    - When there is an opportunity for reuse, components can be built which take in different inputs from different callers.
    - React's philosophy prefers component composition over inheritance.
    - In general, remember to keep coupling between components to a minimum.
    - As mentioned earlier the use of a `React.Fragment` component is not reflected in the `DOM`. This can be useful for certain uses cases. The book provides an example of needing to return table rows.
#### Passing Data Using Properties:
- The way to switch to JavaScript syntax within any JSX snippet is to use curly braces`{}`, to encapsulate the JavaScript.
- The easiest way to pass data to child components is using an attribute (custom or otherwise) when instantiating a component.
- For a complete list of DOM elements and how HTML attributes need to be specified in JSX, see :
https://reactjs.org/docs/dom-elements.html
#### Passing Data Using Children:
- Just like regular HTML, React components can be nested. When React components are converted to HTML element, the elements nest in the same order. React components can act like the `<div>` and take in nested elements. In such a case, the JSX expression will need to include both the opening and closing tags, with the *child* elements nested in them.
#### Dynamic Composition:
- This section replaces the hard-coded set of `IssueRow` components with programmatically generated set of components from an array of issues.
- The `map()` `Array` method is used to map an issue object to an `IssueRow` instance. A `for` loop can not be used instead of the `map()` method, because JSX is not a templating language. JSX only allows JavaScript expressions in the `{}` (curly brackets).
- Every instance of `IssueRow` needed to be identified with an attribute called `key`. React uses the `key` to optimize the calculation of difference when things, change, e.g. a new row is inserted. Here we end up using `ID` of each issue as the `key`, since each uniquely identifies the row.
- React does not automatically call `toString()` on objects that are to be displayed, therefore objects (in this case a `Date`) need to be explicitly converted to strings.

### Errors & Issues:
- Listing 3-6 is missing an opening single quote for  `New` in and should read `...status: 'New'`.
- In Listing 3-8, I accidentally did not initially change the `issues.map()` method contents. Specifically, I did not change `rowStyle` to `key`, within the `IssueRow` mapping, causing the browser to not render anything.


## Chapter 2
### Summary:
Served as an introduction to how React applications can be built. Provides an introduction using Node.js and NPM. Also installed Babel in order to be able to transpile code for support of older browsers.

![ch02](/readme_images/chapter2_hello_continents.png)

### Chapter 2 Notes:

- React is a JavaScript file that comes in two parts:
    1. The first is the React core module, the one responsible for dealing with React components, their state manipulation, etc.
    2. The second is the ReactDOM module, which deals with converting React components to a DOM that the browser can understand.
 - JSX (JavaScript XML) is a React markup language with similar syntax to HTML.
- Babel is used to compile JSX into regular JavaScript to be injected and used by the browser.
- npm (Node Package Manager) is powerful with many options. The location of installed files under a project directory is a conscious choice made by the makes of npm. It has three (3) important effects:
    1. All installations are *local* to the project directory. This means that a different project can use a different version of any of the installed packages.
    2. A package's dependencies are also isolated within the package.
    3. Administrator (superuser) rights are note needed to install a package.
- Command to start the server: `npm start`.
- To determine the babel version after installation without local directory file path constraints, the command  `npx babel --version` can be executed at the command line.
- Custom `npm run` scripts can be written and added to the `package.json` file. 
- `npm run watch` shortcut command was implemented. Its purpose is to watch the client-side code where the source files are changed frequently, and automatically recompile.
- `npm start` shortcut command was implemented. Its purpose is to restart `Node.js` whenever there is a change in a set of files. Here we make sure that there `server` directory is tracked for changes, and `Node.js` is restarted accordingly..
- When the command  `npm run watch` is executed a JSX transform is performed, but it doesn't return to the shell. It waits in a permanent loop by watching for changes in the source files. In order to run the server, another terminal is needed, where `npm start` can be executed.

### Errors & Issues:
 - Listing 2-1 should read  `ReactDOM.render(element, document.getElementByID('contents'));`. The listing has a typo and pass the argument `content` instead of `contents` inside the `getElementByID()` method. The typo causes the method to return `null` and not properly render *"Hello World"* because no element with that ID exists.
 - For build time JSX transformation, babel tools needed to be installed. I had an issue with installation. Resolved after realizing that `npm install --save-dev @babel/core@7 @babel/cli@7` needed to be executed within the `src` folder.
 - Listing 2-7 is missing an opening `<` and should read  `<script src="App.js></script>`.









