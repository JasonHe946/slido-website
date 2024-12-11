"npm run test"     for component testing
"npm run cypress"  for ui testing

UI testing

The first happy path was provided to use in the spec. The main steps involve creating a new presentation, adding slides, switching betweeen slides and deleting the presentation. 
Happy path 1:
1. Registers successfully
2. Creates a new presentation successfully
3. Updates the thumbnail and name of the presentation successfully
4. Add some slides in a slideshow deck successfully
5. Switch between slides successfully
6. Delete a presentation successfully
7. Logs out of the application successfully
8. Logs back into the application successfully

The second happy path I chose aims to demonstrate slide functionality in each presentation as it is what a slide website will predominately be used for. This involves adding all 4 types of elements, being able to update the content / attributes of all 4 types of elements as well as being able to move all 4 types of elements around the slide. It also demonstrates changing the theme of the slide which acts as a background image behind all the elements we just added. 
Happy path 2:
1. Navigates to landing page
2. Successfully reigsters a new user
3. Creates a new presentation successfully
4. Creates a new text element
5. Updates the attributes of this new text element
6. Moves the text element on the slide
7. Creates a new image element
8. Updates the attributes of this new image element
9. Moves the image element on the slide
10. Creates a new video element
11. Updates the attributes of this new video element
12. Moves the video element on the slide
13. Creates a new code element
14. Updates the attributes of this new code element
15. Change theme of the slide to a starry night image
16. Delete presentation successfully 
17. Logout successfully

Component testing
List of components tested:
- NewCodeModal.jsx
- DashboardCard.jsx
- DashboardPage.jsx
- ErrorModal.jsx
- LandingPage.jsx
- LoginPage.jsx

NewCodeModal test:
1. Renders the modal correctly when open is true
    - 'create code element' title should be visible
    - 'insert code block' input should be visible
    - 'font size' input should be visible
    - width slider should be visible
    - height slider should be visible
2. Doesn't render the modal when open is false
    - all elements of modal should not be visible on document
3. Handles code input change and language detection
    - start typing js and helper text should indicate js is being typed
    - start typing python and helper text should indicate python is being typed
    - start typing c and helper text should indicate c is being typed
    - start typing random text and helper text should prompt for valid language to be inputted
4. Create button is disabled for invalid code input
    - valid font size input + invalid code input = disabled button
5. Create button is disabled for invalid font size input
    - invalid font size input + valid code input = disabled button
6. Create button enabled for valid form input
    - valid input for both fields = button enabled
    - updateStore should be called when we create this new element
7. Close function on modal works
    - closes modal when close button is clicked

DashboardCard test:
1. Render correctly with given props
    - 'Custom title' should be visible in card
    - 'Custom description' is visible on card
    - 'length' of deck is visible on card
    - image thumbnail should be visible on card
2. Navigates to correct deck when clicked
    - card itself should be clickable
    - when clicked, navigates to the correct url with correct deckid embedded in it
3. Prompts edit and delete presentation when right clicked
    - on right click of the card, a menu should be visible
    - 'Edit Details' should be visible on this menu
    - 'Delete presentation' should be visible on this menu

DashboardPage test:
1. Render correctly with given props
    - Deck 1 presentation is visible
    - Coolest presentation is visible
    - Search query is visible
    - New Deck button is visible
2. Filter decks correctly based on search query
    - Upon typing Deck 1 in query, only Deck 1 should be visible, coolest is invisible
    - Upon typing Coolest in query, Deck 1 is no longer visible, coolest is now visible
    - Upon tying Random in query, none of the decks are visible
3. Display all decks with query is cleared
    - when query is cleared, both Deck 1 and coolest are visible
4. New Deck modal working correctly
    - New deck modal button is visible
    - When clicked, a modal opens
    - Create presentation title should be visible in this modal
5. Display empty state when no decks in store
    - When emtpy state, verify that the "it looks emtpy in here" text is visible

ErrorModal test:
1. Render error modal when open is true
    - "generic error title" should be visible
    - "generic error description" should be visible
2. Doesn't render error modal when open is false
    - "generic error title" should not be visible
    - "generic error description" should not be visible
3. Close button runs the handleClose function
    - close button is visible
    - upon clicking, it renders the handleclose function passed in 
4. Renders custom title and custom description that is passed in 
    - "custom error title" should be visible
    - "custom error description" should be visible

LandingPage test:
1. Renders page correctly
    - login button should be visible
    - register button should be visible
    - Welcome, presto and description for landing page is visible
    - landing page image is visible
2. Navigate to login correctly
    - when login button is clicked, it should navigate to url /login
3. Navigate to register correctly
    - when register button is clicked, it should navigate to url /register

LoginPage test:
1. Renders login and handles successful login
    - Email and password input fields are visible
    - type in sample email and password
    - login button should be visible
    - upon clicking, local storage is set to a token and a setToken function is passed on
    - navigates to dashboard upon successfuly login
2. Open error modal upon login failure
    - input sample incorrect email and password
    - upon clicking of login, an error modal should appear
    - "Login error" and "invalid email or password" should be visible
3. Navigates to register page upon link
    - "sign up here" link visible
    - upon clicking, correctly navigates to register page
4. Navigates to landing page upon back button
    - back button visible
    - upon clicking, correctly navigates back to landing page

