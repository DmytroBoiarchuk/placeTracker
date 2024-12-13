import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectCity from "./SelectCity";
import { useQuery } from "@tanstack/react-query";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

const setCoordinates = jest.fn();

describe("SelectCity Component", () => {
  const renderSelectCity = () => {
    render(<SelectCity setCoordinates={setCoordinates} />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: [
        { geonameId: "1", name: "Paris", lat: "50.5487", lng: "5.0454" },
        { geonameId: "2", name: "London", lat: "51.5074", lng: "-0.1278" },
        {
          geonameId: "3",
          name: "Los Angeles",
          lat: "34.0522",
          lng: "-118.2437",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    }));
  });
  test("should show city matches on input change", async () => {
    renderSelectCity();
    const cityInput: HTMLInputElement =
      screen.getByPlaceholderText("ex: London");
    fireEvent.focus(cityInput);
    fireEvent.change(cityInput, {
      target: { value: "Lo" },
    });

    await waitFor(() => expect(screen.getByText("London")).toBeInTheDocument());
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
  });

  test("should update input value and coordinates when a city is clicked", async () => {
    renderSelectCity();
    const cityInput: HTMLInputElement =
      screen.getByPlaceholderText("ex: London");

    // Simulate typing into the input field
    fireEvent.change(cityInput, {
      target: { value: "Lon" },
    });

    // Click on the city
    fireEvent.focus(cityInput);
    fireEvent.mouseDown(screen.getByText("London"));

    // Check if the coordinates are set
    expect(setCoordinates).toHaveBeenCalledWith({
      lat: "51.5074",
      lng: "-0.1278",
    });

    // Check if the input value has been updated
    expect(screen.getByPlaceholderText("ex: London")).toHaveValue("London");
  });

  test("should hide city list when input loses focus", async () => {
    renderSelectCity();
    const cityInput: HTMLInputElement =
      screen.getByPlaceholderText("ex: London");

    // Simulate typing into the input field
    fireEvent.change(screen.getByPlaceholderText("ex: London"), {
      target: { value: "Lon" },
    });

    // Check if the city list appears
    fireEvent.focus(cityInput);
    expect(screen.getByText("London")).toBeInTheDocument();

    // Simulate input blur
    fireEvent.blur(cityInput);

    // Check if the city list is hidden
    expect(screen.queryByText("London")).not.toBeInTheDocument();
  });

  test("should display error message if query fails",  () => {
    (useQuery as jest.Mock).mockImplementationOnce(() => ({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Error with status: 404" },
    }));
    renderSelectCity();

    // Check if the error message is displayed
      waitFor(() =>
         expect(screen.getByText("Error with status: 404")).toBeInTheDocument(),
     );
  });
});
