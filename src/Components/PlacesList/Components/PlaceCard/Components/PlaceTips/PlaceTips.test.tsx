import { render, screen } from "@testing-library/react";
import PlaceTips from "./PlaceTips";

const tipsData = [
  { created_at: "2024-12-01T10:00:00Z", text: "Great place!" },
  { created_at: "2024-12-02T14:00:00Z", text: "Amazing service!" },
];

describe("PlaceTips Component", () => {
  test("renders tips when shown", () => {
    render(<PlaceTips isTipsShown={true} tips={tipsData} />);
    expect(screen.getByText("Great place!")).toBeInTheDocument();
    expect(screen.getByText("Amazing service!")).toBeInTheDocument();
    expect(screen.getByText("01.12.2024 10:00")).toBeInTheDocument();
  });

  test("does not render tips when hidden", async () => {
    render(<PlaceTips isTipsShown={false} tips={tipsData} />);
    expect(screen.getByTestId("place-tips")).toHaveStyle("display: none");
  });
});
