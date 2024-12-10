import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WishListContext } from "../../../../store/wishListContext";
import PlaceCard from "./PlaceCard.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

window.fetch = jest.fn()
jest.mock('../../../../constants/constants.ts', ()=>({
    VITE_FOURSQUARE_API_KEY: 'mock-api-key'

}));
const queryClient = new QueryClient();

describe("PlaceCard Component", () => {
    const mockContext = {
        storedArray: [],
        setPlace: jest.fn(),
        removePlace: jest.fn(),
    };

    test("renders loading spinner while fetching", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <WishListContext.Provider value={mockContext}>
                    <PlaceCard fsq_id="test-id" />
                </WishListContext.Provider>
            </QueryClientProvider>
        );

        expect(screen.getByAltText("spiner")).toBeInTheDocument();
    });

    test("renders place information when fetch is successful", async () => {
        const mockResponse = {
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
        };
        jest.spyOn(window, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        } as Response);

        render(
            <QueryClientProvider client={queryClient}>
                <WishListContext.Provider value={mockContext}>
                    <PlaceCard fsq_id="test-id" />
                </WishListContext.Provider>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Place")).toBeInTheDocument();
            expect(screen.getByText("123 Main St")).toBeInTheDocument();
        });

    });

    test("calls context methods when saving/removing places", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <WishListContext.Provider value={{ ...mockContext, storedArray: [] }}>
                    <PlaceCard fsq_id="test-id" />
                </WishListContext.Provider>
            </QueryClientProvider>
        );

        const saveButton = await screen.findByRole("button");
        fireEvent.click(saveButton);

        expect(mockContext.setPlace).toHaveBeenCalledWith("test-id");
    });
});
