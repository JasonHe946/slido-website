
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewCodeModal from "../components/NewCodeModal";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";


describe("NewCodeModal component", () => {
  it("renders the modal correctly when open is true", () => {
    render(
      <MemoryRouter>
        <NewCodeModal
          open={true}
          onClose={vi.fn()} 
          updateStore={vi.fn()}
          store={{ decks: [] }}
          slideId={1}
        />
      </MemoryRouter>
    );

    // Check if all modal elements are present
    expect(screen.getByText("Create Code Element")).toBeInTheDocument();
    expect(screen.getByLabelText("Insert code block")).toBeInTheDocument();
    expect(screen.getByLabelText("Font size (em) *")).toBeInTheDocument();
		expect(screen.getByText(/Width \(%\): 50/i)).toBeInTheDocument();
    expect(screen.getByText(/Height \(%\): 50/i)).toBeInTheDocument();
  });

	it("doesn't render the modal when open is false", () => {
    render(
      <MemoryRouter>
        <NewCodeModal
          open={false}
          onClose={vi.fn()} 
          updateStore={vi.fn()} 
          store={{ decks: [] }} 
          slideId={1}
        />
      </MemoryRouter>
    );

    // No modal elements should be present
		expect(screen.queryByText("Create Code Element")).not.toBeInTheDocument();
    expect(screen.queryByText("Insert code block")).not.toBeInTheDocument();
		expect(screen.queryByText("Font size (em) *")).not.toBeInTheDocument();
  });

  it("handles code input change and language detection", async () => {
    render(
      <MemoryRouter>
        <NewCodeModal
          open={true}
          onClose={vi.fn()}
          updateStore={vi.fn()}
          store={{ decks: [] }}
          slideId={1}
        />
      </MemoryRouter>
    );

    const codeInput = screen.getByLabelText("Insert code block");

    // Simulate typing a javascript code snippet into the input
    await userEvent.type(codeInput, `console.log("Hello, World!");`);
    expect(screen.getByText("Language inputted: javascript")).toBeInTheDocument();

		// changing code snippet to python and checking language detection
    await userEvent.clear(codeInput);
    await userEvent.type(codeInput, `print("hi")`);
    expect(screen.getByText("Language inputted: python")).toBeInTheDocument();

		// changing code snippet to c and checking language detection
    await userEvent.clear(codeInput);
    await userEvent.type(codeInput, `#include <stdio.h>`);
    expect(screen.getByText("Language inputted: c")).toBeInTheDocument();

		//changing code to random text and checking language detection
		await userEvent.clear(codeInput);
    await userEvent.type(codeInput, `my name is Jason`);
    expect(screen.getByText("Please enter code in either Python, C, or Javascript")).toBeInTheDocument();
  });

  it("create button is disabled for invalid code input", async () => {
    const mockUpdateStore = vi.fn();
    const mockClose = vi.fn();

    render(
      <MemoryRouter>
        <NewCodeModal
          open={true}
          onClose={mockClose}
          updateStore={mockUpdateStore}
          store={{ decks: [] }}
          slideId={1}
        />
      </MemoryRouter>
    );

    // Simulate filling out the form with invalid code input
    const codeInput = screen.getByLabelText("Insert code block");
    await userEvent.type(codeInput, `jordan was here`);
		expect(screen.getByText("Please enter code in either Python, C, or Javascript")).toBeInTheDocument();

    const fontSizeInput = screen.getByLabelText("Font size (em) *");
    await userEvent.type(fontSizeInput, "1");

    const createButton = screen.getByText("Create");
    expect(createButton).toBeDisabled();
  });

	it("create button is disabled for invalid font size input", async () => {
    const mockUpdateStore = vi.fn();
    const mockClose = vi.fn();

    render(
      <MemoryRouter>
        <NewCodeModal
          open={true}
          onClose={mockClose}
          updateStore={mockUpdateStore}
          store={{ decks: [] }}
          slideId={1}
        />
      </MemoryRouter>
    );

    // Simulate filling out the form with invalid font size input
    const codeInput = screen.getByLabelText("Insert code block");
    await userEvent.type(codeInput, `console.log('hi')`);
		expect(screen.getByText("Language inputted: javascript")).toBeInTheDocument();

    const fontSizeInput = screen.getByLabelText("Font size (em) *");
    await userEvent.type(fontSizeInput, "-1");
		expect(screen.getByText("Must be positive number")).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeDisabled();
  });

	it("create button is enabled for valid input", async () => {
    const mockUpdateStore = vi.fn();
    const mockClose = vi.fn();

    render(
      <MemoryRouter>
        <NewCodeModal
          open={true}
          onClose={mockClose}
          updateStore={mockUpdateStore}
          store={{ decks: [] }}
          slideId={1}
        />
      </MemoryRouter>
    );

    // Simulate filling out the form with valid details
    const codeInput = screen.getByLabelText("Insert code block");
    await userEvent.type(codeInput, `console.log('hi')`);
		expect(screen.getByText("Language inputted: javascript")).toBeInTheDocument();

    const fontSizeInput = screen.getByLabelText("Font size (em) *");
    await userEvent.type(fontSizeInput, "1");
		expect(screen.queryByText("Must be positive number")).not.toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).not.toBeDisabled();
		await userEvent.click(createButton);
		// Check if updateStore was called after clicking "Create"
		await waitFor(() => {
			expect(mockUpdateStore).toHaveBeenCalledTimes(1);
		});
  });

  it("calls the close function when the close icon is clicked", async () => {
    const mockClose = vi.fn(); 

    render(
      <MemoryRouter>
        <NewCodeModal
          open={true}
          onClose={mockClose}
          updateStore={vi.fn()}
          store={{ decks: [] }}
          slideId={1}
        />
      </MemoryRouter>
    );

    const closeButton = screen.getByLabelText("close");
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});