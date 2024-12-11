/* eslint-env cypress */

describe("user happy path 1", () => {
  it("should successfully execute the first happy path", () => {
    // successfully visit landing page
    window.cy.visit("http://localhost:3000/");
    window.cy.url().should("include", "localhost:3000");

    // successfully register a new user
    window.cy.get('button[name="register-button"]').click();
    window.cy.url().should("include", "localhost:3000/register");
    window.cy.get('input[name="register-email"]').focus().type(`jason51@email.com`);
    window.cy.get('input[name="register-password"]').focus().type("password");
    window.cy.get('input[name="register-confirm-password"]').focus().type("password");
    window.cy.get('input[name="register-name"]').focus().type("jason");
    window.cy.get('button[name="register-submit"]').click();
    // window.cy.wait(1000);

    // successfuly create a new presentation on the dashboard and clicks on the newly created dashboard card
    window.cy.url().should("include", "localhost:3000/dashboard");
    window.cy.get('button[name="new-presentation-btn"]').click();
    window.cy.get('input[name="new-presentation-name"]')
      .focus()
      .type("Diary of a wimpy kid");
    window.cy.get('input[name="new-presentation-description"]')
      .focus()
      .type("Greg Heffley description");
    window.cy.get('input[name="new-presentation-image-url"]')
      .focus()
      .type(
        "https://www.billboard.com/wp-content/uploads/2022/08/Ariana-Grande-the-voice-2021-billboard-1548.jpg?w=1024"
      );
    window.cy.get('button[name="new-presentation-submit"]').click();
    window.cy.get(".presentation-card").first().click();

    // create new text element
    window.cy.get('button[name="add-text-btn"]').click();
    window.cy.get('input[name="new-text-element"]')
      .focus()
      .type("Jordan went on a brisk walk");
    window.cy.get('input[name="new-text-element-font"]').focus().type("1");
    window.cy.get('input[name="new-text-element-colour"]').focus().type("#0000ff");
    window.cy.get('button[name="create-new-text-element-submit"]').click();

    // Update the text element  
    window.cy.get(".new-text-element-created").first().dblclick();
    window.cy.get('input[name="edit-text-element"]')
      .focus()
      .clear()
      .type("Jason went to the beach");
    window.cy.get('input[name="edit-text-element-font"]').focus().clear().type("3");
    window.cy.get('input[name="edit-text-element-colour"]')
      .focus()
      .clear()
      .type("#FFC0CB");
    window.cy.get('button[name="edit-text-element-submit"]').click();
    //  Move the text element
    window.cy.get(".new-text-element-created").first().click();
    window.cy.get(".new-text-element-created")
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 100, clientY: 100 })
      .trigger("mouseup");

    // create new image element
    window.cy.get('button[name="add-image-btn"]').click();
    window.cy.get('input[name="new-image-element-description"]')
      .focus()
      .type("Bruno mars");
    window.cy.get('input[name="new-image-element-imageURL"]')
      .focus()
      .type(
        "https://i8.amplience.net/i/naras/bruno-mars_MI0004141313-MN0001032082"
      );
    window.cy.get('button[name="create-new-image-element-submit"]').click();

    // Update the image element
    window.cy.get(".new-image-element-created").first().dblclick();
    window.cy.get('input[name="edit-image-element-description"]')
      .focus()
      .clear()
      .type("Taylor swift");
    window.cy.get('input[name="edit-image-element-imageURL"]')
      .focus()
      .type(
        "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2024/10/taylor-swift-inc.jpg"
      );
    window.cy.get('button[name="edit-image-element-submit"]').click();

    // move the image element
    window.cy.get(".new-image-element-created").first().click();
    window.cy.get(".new-image-element-created")
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 0, clientY: 200 })
      .trigger("mouseup");

    // create new video element, udpate the new video element
    window.cy.get('button[name="add-video-btn"]').click();
    window.cy.get('input[name="new-video-element-url"]')
      .focus()
      .type("https://www.youtube.com/embed/6ONRf7h3Mdk?si=UePKA_Qd5YeaHFM5");
    window.cy.get('button[name="create-new-video-element-submit"]').click();

    // update the new video element 
    window.cy.get(".new-video-element-created").first().dblclick({ position: "top" });
    window.cy.get('input[name="edit-video-element-url"]')
      .focus()
      .clear()
      .type("https://www.youtube.com/embed/V9PVRfjEBTI?si=jqzVmIxvJvneDLDQ");
    window.cy.get('button[name="edit-video-element-submit"]').click();

    // move the video element
    window.cy.get(".new-video-element-created").first().click({ position: "top" });
    window.cy.get(".new-video-element-created")
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 200, clientY: 0 })
      .trigger("mouseup");

    // create new code element
    window.cy.get('button[name="add-code-btn"]').click();
    window.cy.get('textarea[name="new-code-element-text"]')
      .focus()
      .type("console.log('hello')");
    window.cy.get('input[name="new-code-element-font"]').focus().type("1");
    window.cy.get('button[name="create-new-code-element-submit"]').click();

    // update the new code element
    window.cy.get(".new-code-element-created").first().dblclick();
    window.cy.get('textarea[name="edit-code-element"]')
      .focus()
      .clear()
      .type("print('no fear jordan is here')");
    window.cy.get('button[name="edit-code-element-submit"]').click();

    // change theme to starry night sky
    window.cy.get('button[name="change-theme-btn"]').click();
    window.cy.get('input[type="radio"][value="image"]').check();
    window.cy.get('input[name="change-theme-imageURL"]')
      .focus()
      .type("https://images4.alphacoders.com/135/thumb-1920-1355525.png");
    window.cy.get('button[name="change-theme-submit"]').click();
    window.cy.wait(1000);

    // delete presentation successfully taking you back to dashboard
    window.cy.get('button[name="delete-deck-btn"]').click();
    window.cy.get('button[name="yes-confirm-btn"]').click();
    window.cy.url().should("include", "localhost:3000/dashboard");

    // logout
    window.cy.get('button[name="logout-btn"]').click();
  });
});
