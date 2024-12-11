describe("user happy path 1", () => {
  it("should successfully execute the first happy path", () => {
    // successfully visit landing page
    window.cy.visit("http://localhost:3000/");
    window.cy.url().should("include", "localhost:3000");

    // successfully register a new user
    window.cy.get('button[name="register-button"]').click();
    window.cy.url().should("include", "localhost:3000/register");

    window.cy.get('input[name="register-email"]').focus().type(`jason7@email.com`);
    window.cy.get('input[name="register-password"]').focus().type("password");
    window.cy.get('input[name="register-confirm-password"]').focus().type("password");
    window.cy.get('input[name="register-name"]').focus().type("jason");
    window.cy.get('button[name="register-submit"]').click();

    // successfuly create a new presentation on the dashboard and clicks on the newly created dashboard card
    window.cy.url().should("include", "localhost:3000/dashboard");
    window.cy.get('button[name="new-presentation-btn"]').click();
    window.cy.get('input[name="new-presentation-name"]')
      .focus()
      .type("Coolest presentation");
    window.cy.get('input[name="new-presentation-description"]')
      .focus()
      .type("This is a cool presentation");
    window.cy.get('input[name="new-presentation-image-url"]')
      .focus()
      .type(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTenp49lG3DDWsWxhb2eiwRcDXva9Cs1aG7hA&s"
      );
    window.cy.get('button[name="new-presentation-submit"]').click();
    window.cy.get(".presentation-card").first().click();

    // successfully edits the title
    window.cy.get("h1").should("have.text", "Coolest presentation"); // Adjust selector to your SlideTitle component
    window.cy.get('[aria-label="edit-title"]').click();
    window.cy.get('input[name="edit-title-input"]').clear().type("New Edited Title");
    window.cy.get('input[name="edit-title-input"]').blur();
    window.cy.get("h1").should("have.text", "New Edited Title");

    // successfully edits the thumbnail of the presentation
    window.cy.get('button[name="edit-thumbnail-btn"]').click();
    window.cy.get('input[name="edit-thumbnail-image-url"]')
      .focus()
      .type(
        "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
      );
    window.cy.get('button[name="edit-thumbnail-confirm"]').click();

    // successfully adds 3 slides to the presentation
    window.cy.get('button[name="add-slide-btn"]').click();
    window.cy.get('button[name="add-slide-btn"]').click();
    window.cy.get('button[name="add-slide-btn"]').click();

    // navigate to the last slide and then navigate back to the first slide
    window.cy.get('button[name="next-slide-btn"]').click();
    window.cy.get('button[name="next-slide-btn"]').click();
    window.cy.get('button[name="next-slide-btn"]').click();

    window.cy.get('button[name="previous-slide-btn"]').click();
    window.cy.get('button[name="previous-slide-btn"]').click();
    window.cy.get('button[name="previous-slide-btn"]').click();


    // delete presentation successfully taking you back to dashboard
    window.cy.get('button[name="delete-deck-btn"]').click();
    window.cy.get('button[name="yes-confirm-btn"]').click();
    window.cy.url().should("include", "localhost:3000/dashboard");


    // successfully logout
    window.cy.get('button[name="logout-btn"]').click();
    window.cy.url().should("include", "localhost:3000");


    // successfully login
    window.cy.get('button[name="login-button"]').click();
    window.cy.get("#login-email-input").focus().type("jason7@email.com");
    window.cy.get("#login-password-input").focus().type("password");
    window.cy.get('button[name="login-submit"]').click();
  });
});
