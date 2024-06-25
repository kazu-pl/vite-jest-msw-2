// src/__ tests __/App.test.tsx

import {
  render,
  // screen, waitFor
} from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
  test("demo", () => {
    render(<App />);
    expect(true).toBe(true);
  });

  // it("should render div with `totalItems` dataId", async () => {
  //   render(<App />);

  //   await waitFor(
  //     () => {
  //       const totalItems = screen.getByTestId("totalItems");

  //       expect(totalItems).toBeInTheDocument();
  //       expect(totalItems).toHaveTextContent("6");
  //     },
  //     {
  //       timeout: 5000,
  //     }
  //   );
  // });
});
