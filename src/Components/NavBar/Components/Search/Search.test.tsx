import { render, screen, fireEvent } from "@testing-library/react";

import { useQuery } from "@tanstack/react-query";
import Search from "./Search.tsx";
import { CacheKeyContext } from "../../../../store/cacheKeyContext.tsx";
import { useNavigate } from "react-router";

jest.mock("../../../../constants/constants.ts", () => ({
  VITE_FOURSQUARE_API_KEY: "mock-api-key",
}));
jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));
//const queryClient = new QueryClient();

describe("Search Component", () => {
  const mockAddCache = jest.fn();
  const mockNavigate = jest.fn();
  const renderSearch = () => {
    render(
      <CacheKeyContext.Provider
        value={{
          addCache: mockAddCache,
          searchTerm: "pizza",
          coordinates: { lat: "45", lng: "50" },
        }}
      >
        <Search />
      </CacheKeyContext.Provider>,
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: [{ name: "Paris", someData: "data" }],
      isLoading: false,
      isError: false,
      error: null,
    }));
  });
  test("renders input fields and button", () => {
    renderSearch();

    expect(screen.getByPlaceholderText("ex: Big Ben")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ex: London")).toBeInTheDocument();
    expect(screen.getByText(/find:/i)).toBeInTheDocument();
    expect(screen.getByText(/in:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("does not trigger search if fields are empty", () => {
    renderSearch();

    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.click(searchButton);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockAddCache).not.toHaveBeenCalled();
  });
  test("trigger search if fields are valid", async () => {
    renderSearch();

    const searchButton: HTMLButtonElement = screen.getByRole("button", {
      name: /search/i,
    });
    const searchInput: HTMLInputElement =
      screen.getByPlaceholderText("ex: Big Ben");
    const cityInput: HTMLInputElement =
      screen.getByPlaceholderText("ex: London");

    //imitating input in uncontrolled input element
    searchInput.value = "Efel Tower";
    fireEvent.change(searchInput, { target: { value: "Efel Tower" } });

    //imitating input in controlled input element
    fireEvent.change(cityInput, { target: { value: "Paris" } });
    expect(cityInput).toHaveValue('Paris');

    //search
    fireEvent.click(searchButton);
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockAddCache).toHaveBeenCalled();
  });
  test("shows loading spinner when loading", () => {
    (useQuery as jest.Mock).mockImplementationOnce(() => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    }));
    renderSearch();

    const spinner = screen.getByAltText(/loading.../i);
    expect(spinner).toHaveStyle("visibility: visible");
  });

  test("displays error component on error", () => {
    const mockError = { message: "Something went wrong" };
    (useQuery as jest.Mock).mockImplementationOnce(() => ({
      data: null,
      isLoading: false,
      isError: true,
      error: mockError,
    }));

    renderSearch();

    expect(screen.getByText(/OoPs!! Something went wrong/i)).toBeInTheDocument();
  });
});
