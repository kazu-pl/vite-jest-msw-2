// src/__ tests __/App.test.tsx

import {
  render,
  screen,
  // waitFor
} from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
  // test("demo", () => {
  //   render(<App />);
  //   expect(true).toBe(true);
  // });

  it("should render div with `totalItems` dataId", async () => {
    render(<App />);

    const totalItems = await screen.findByTestId("totalItems");

    console.log({
      WHERE: "in test 'should render div with `totalItems` dataId'",
      totalItems_textContent: totalItems.textContent,
    });

    expect(totalItems).toBeInTheDocument();
    expect(totalItems).toHaveTextContent("1");
  });
});
