import { render, screen} from "@testing-library/react";
import Gallery from "./Gallery";
import {PhotosArrayInterface} from "../../interfaces/interfaces.ts";

const mockData: PhotosArrayInterface[] = [
  { prefix: "https://example.com/", suffix: ".jpg", width: 300, height: 200, id: 'test_id1',
      created_at: new Date().toDateString(), classifications: undefined },
  { prefix: "https://example.com/2/", suffix: ".jpg", width: 300, height: 200, id: 'test_id2',
      created_at: new Date().toDateString(), classifications: undefined },
];

describe("Gallery Component", () => {
  test("renders first photo by default", () => {
    render(<Gallery alt="Test Alt" photos={mockData} />);
    expect(screen.getByAltText("Test Alt")).toHaveAttribute(
      "src",
      "https://example.com/300x200.jpg",
    );
  });
});
