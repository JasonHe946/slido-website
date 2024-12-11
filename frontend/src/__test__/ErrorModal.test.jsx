// ErrorModal.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorModal from "../components/ErrorModal"; // Adjust the path as needed
import { describe, it, expect, vi } from "vitest";

describe("ErrorModal component", () => {
  it("renders the error modal when open is true", () => {
    render(
      <ErrorModal
        open={true}
        handleClose={vi.fn()}
        title="Generic error title"
        description="Generic error description"
      />
    );

    // Check if the generic title and description are rendered on the screen
    expect(screen.getByText("Generic error title")).toBeInTheDocument();
    expect(screen.getByText("Generic error description")).toBeInTheDocument();
  });

  it("doesn't render the error modal when open is false", () => {
    render(
      <ErrorModal
        open={false}
        handleClose={vi.fn()}
        title="Generic error title"
        description="Generic error description"
      />
    );

    // Error Modal text should not be in the document
    expect(screen.queryByText("Generic error title")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Generic error description")
    ).not.toBeInTheDocument();
  });

  it("when close button is clicked it runs the handleClose function passed in", async () => {
    const handleClose = vi.fn();
    render(
      <ErrorModal
        open={true}
        handleClose={handleClose}
        title="Generic error title"
        description="Generic error description"
      />
    );

    const closeButton = screen.getByLabelText("close");
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders a custom title and custom description passed in", async () => {
    const handleClose = vi.fn();
    const customTitle = "custom title";
    const customDescription = "custom description";
    render(
      <ErrorModal
        open={true}
        handleClose={handleClose}
        title={customTitle}
        description={customDescription}
      />
    );
    expect(screen.getByText("custom title")).toBeInTheDocument();
    expect(screen.getByText("custom description")).toBeInTheDocument();
  });
});
