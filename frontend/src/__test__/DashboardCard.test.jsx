import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import { StoreContext } from '../components/StoreContext';

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: vi.fn(),
  };
});

describe("DashboardCard component", () => {
  it("renders correctly with given props", () => {
		const mockStore = { decks: [] };
		const setMockStore = vi.fn();
		render(
			<StoreContext.Provider value={{ store: mockStore, setStore: setMockStore }}>
				<MemoryRouter>
					<DashboardCard
						id={1}
						title="Custom Title"
						description="Custom Description"
						length={5}
						thumbnail="custom-thumbnail.jpg"
					/>
				</MemoryRouter>
			</StoreContext.Provider>
		);

    // Check if title and description are rendered
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText(/Description:Custom Description, Length: 5/)).toBeInTheDocument();

    // Check if the image is rendered with the correct alt text
    const image = screen.getByAltText("slide thumbnail");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "custom-thumbnail.jpg");
  });

  it("navigates to the corresponding deck with the correct deckid embedded", async () => {
		const mockStore = { decks: [] };
		const setMockStore = vi.fn();
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

		render(
			<StoreContext.Provider value={{ store: mockStore, setStore: setMockStore }}>
				<MemoryRouter>
					<DashboardCard
						id={1}
						title="Custom Title"
						description="Custom Description"
						length={5}
						thumbnail="custom-thumbnail.jpg"
					/>
				</MemoryRouter>
			</StoreContext.Provider>
		);

    const cardActionArea = screen.getByRole("button");
    await userEvent.click(cardActionArea);
    // Check if navigate is called to navigate to the deck page with the deck id
    expect(navigate).toHaveBeenCalledWith("/deck/1");
  });

	it("prompts edit and delete presentation on right click", async () => {
		const mockStore = { decks: [] };
		const setMockStore = vi.fn();
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

		render(
			<StoreContext.Provider value={{ store: mockStore, setStore: setMockStore }}>
				<MemoryRouter>
					<DashboardCard
						id={1}
						title="Custom Title"
						description="Custom Description"
						length={5}
						thumbnail="custom-thumbnail.jpg"
					/>
				</MemoryRouter>
			</StoreContext.Provider>
		);

		// simulate a right click event on the dashboard card to show options to edit and delete presentation
    const cardElement = screen.getByText("Custom Title");
    fireEvent.contextMenu(cardElement);
		expect(screen.getByText("Edit Details")).toBeInTheDocument();
    expect(screen.getByText("Delete Presentation")).toBeInTheDocument();
  });
});