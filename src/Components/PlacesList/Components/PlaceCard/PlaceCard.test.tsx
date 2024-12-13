import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WishListContext } from "../../../../store/wishListContext";
import PlaceCard from "./PlaceCard.tsx";
import { useQuery} from "@tanstack/react-query";

jest.mock('../../../../constants/constants.ts', ()=>({
    VITE_FOURSQUARE_API_KEY: 'mock-api-key'
}));
jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));
jest.mock("react-router", () => ({
    useNavigate: jest.fn(),
}));


describe("PlaceCard Component", () => {
    const mockContext = {
        storedArray: [],
        setPlace: jest.fn(),
        removePlace: jest.fn(),
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
    const renderPlaceCard =() => render(
            <WishListContext.Provider value={mockContext}>
                <PlaceCard fsq_id="test-id" />
            </WishListContext.Provider>
    );
    test("renders loading spinner while fetching", () => {
        (useQuery as jest.Mock).mockImplementationOnce(() => ({
            data: null,
            isPending: true,
            isError: false,
            error: null,
        }));
        renderPlaceCard();
        expect(screen.getByAltText(/spiner/)).toBeInTheDocument();
    });

    test("renders place information when fetch is successful", async () => {
        renderPlaceCard();

        await waitFor(() => {
            expect(screen.getByText("Test Place")).toBeInTheDocument();
            expect(screen.getByText("123 Main St")).toBeInTheDocument();
        });

    });

    test("calls context methods when saving/removing places", async () => {
        renderPlaceCard();

        const saveButton = await screen.findByRole("button");
        fireEvent.click(saveButton);

        expect(mockContext.setPlace).toHaveBeenCalledWith("test-id");
    });
});
