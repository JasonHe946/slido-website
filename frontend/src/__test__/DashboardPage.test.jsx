import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../components/DashboardPage";
import { StoreContext } from "../components/StoreContext";

// Mock the StoreContext to provide fake store data for testing
const mockStore = {
  decks: [
    {
      id: 1,
      title: "Deck 1",
      description: "Description 1",
      thumbnail: "thumbnail1.jpg",
      slides: [],
    },
    {
      id: 2,
      title: "Coolest",
      description: "Description 2",
      thumbnail: "thumbnail2.jpg",
      slides: [],
    },
  ],
};

// Mock updateStore function
const mockUpdateStore = vi.fn();

describe("DashboardPage Component", () => {
  it("renders New Deck button, search bar and all current decks", () => {
    render(
      <StoreContext.Provider value={{ store: mockStore, setStore: vi.fn() }}>
        <MemoryRouter>
          <DashboardPage token="mock-token" updateStore={mockUpdateStore} />
        </MemoryRouter>
      </StoreContext.Provider>
    );
		// check if new deck button is visible
    expect(screen.getByText("New Deck")).toBeInTheDocument();
		// check if search bar is visible
    expect(screen.getByPlaceholderText("Search by title")).toBeInTheDocument();
		// check if both decks are visible
		expect(screen.getByText("Deck 1")).toBeInTheDocument();
		expect(screen.getByText("Coolest")).toBeInTheDocument();
  });

  it("filters decks correctly based on search quiry input", async () => {
    render(
      <StoreContext.Provider value={{ store: mockStore, setStore: vi.fn() }}>
        <MemoryRouter>
          <DashboardPage token="mock-token" updateStore={mockUpdateStore} />
        </MemoryRouter>
      </StoreContext.Provider>
    );

    // Type a search query for first deck
    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "Deck 1" },
    });
    // Verify only deck 1 is visible and not the other deck
    expect(screen.getByText("Deck 1")).toBeInTheDocument();
    expect(screen.queryByText("Coolest")).not.toBeInTheDocument();

		// type another search quiry for second deck
    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "Coolest" },
    });
    // Verify only coolest is visible and not the other deck
    expect(screen.getByText("Coolest")).toBeInTheDocument();
    expect(screen.queryByText("Deck 1")).not.toBeInTheDocument();

		// type a random search quiry and no decks should be visible
		fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "random search query" },
    });
		expect(screen.queryByText("Deck 1")).not.toBeInTheDocument();
		expect(screen.queryByText("Coolest")).not.toBeInTheDocument();
  });

  it("shows all decks when search query is cleared", async () => {
    render(
      <StoreContext.Provider value={{ store: mockStore, setStore: vi.fn() }}>
        <MemoryRouter>
          <DashboardPage token="mock-token" updateStore={mockUpdateStore} />
        </MemoryRouter>
      </StoreContext.Provider>
    );

    // Type a search query and then clear the search query
    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "Deck 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "" },
    });

    // Verify that both decks are now visible
    expect(screen.getByText("Deck 1")).toBeInTheDocument();
    expect(screen.getByText("Coolest")).toBeInTheDocument();
  });

  it("opens the New Deck modal when 'New Deck' button is clicked", () => {
    render(
      <StoreContext.Provider value={{ store: mockStore, setStore: vi.fn() }}>
        <MemoryRouter>
          <DashboardPage token="mock-token" updateStore={mockUpdateStore} />
        </MemoryRouter>
      </StoreContext.Provider>
    );

    // Click the "New Deck" button
    fireEvent.click(screen.getByText("New Deck"));
    // Verify the modal is open
    expect(screen.getByText("Create Presentation")).toBeInTheDocument();
  });

  it("shows empty state when there are no decks", () => {
    const emptyStore = { decks: [] };

    render(
      <StoreContext.Provider value={{ store: emptyStore, setStore: vi.fn() }}>
        <MemoryRouter>
          <DashboardPage token="mock-token" updateStore={mockUpdateStore} />
        </MemoryRouter>
      </StoreContext.Provider>
    );

    // Verify the empty state message
    expect(screen.getByText("It looks empty in here!")).toBeInTheDocument();
  });
});
