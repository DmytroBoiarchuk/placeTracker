import {fireEvent, render, screen} from "@testing-library/react";
import WishList from "./WishList";
import  {
  WishListContext,
} from "../../store/wishListContext.tsx";
import { WishListContextInterface } from "../../interfaces/interfaces.ts";
import { useQuery } from "@tanstack/react-query";

jest.mock("../../constants/constants.ts", () => ({
  VITE_FOURSQUARE_API_KEY: "mock-api-key",
}));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

describe("WishList Component", () => {
  const mockContext: WishListContextInterface = {
    storedArray: [],
    setPlace: jest.fn(),
    removePlace: jest.fn(),
  };
  const renderWishList = (context: WishListContextInterface) => {
    return render(
      <WishListContext.Provider value={context}>
        <WishList />
      </WishListContext.Provider>,
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: {
        name: "Test Place",
        categories: [
          {
            icon: { prefix: "https://example.com/", suffix: ".png" },
          },
        ],
        location: { address: "123 Main St" },
        photos: [
          {
            prefix: "https://example.com/photo",
            suffix: ".jpg",
            width: 300,
            height: 200,
          },
        ],
      },
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
    }));
  });

  test("should render 'No cities added yet' message when storedArray is empty", () => {
    const emptyArrayContextValue: WishListContextInterface = {
      ...mockContext,
      storedArray: [],
    };

    renderWishList(emptyArrayContextValue);

    // Check if the 'No cities added yet' message is displayed
    expect(screen.getByText("No cities added yet :(")).toBeInTheDocument();
  });

  test("should render the list of places when storedArray has items", () => {
    const contextWithSomePlaces = {
      ...mockContext,
      storedArray: ["place1", "place2"],
    };

    renderWishList(contextWithSomePlaces);
    // Ensure two PlaceCard components
    expect(screen.getAllByTestId("Place Card").length).toBe(2);
  });

  test("to remove card when remove button was clicked",async () => {
    // Without passing a context value, ensure that no content is rendered
    const contextWithSomePlaces = {
      ...mockContext,
      storedArray: ["place1"],
    };

    renderWishList(contextWithSomePlaces);
    const savedButton = await screen.getByTestId("saved")
    fireEvent.click(savedButton)

    expect(contextWithSomePlaces.removePlace).toHaveBeenCalled();
  });
});
