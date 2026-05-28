import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("adds a participant to the list", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/insert a name/i), "Alice");
  await user.click(screen.getByRole("button", { name: /add/i }));

  expect(screen.getByText(/1\.\s*Alice/)).toBeInTheDocument();
});
