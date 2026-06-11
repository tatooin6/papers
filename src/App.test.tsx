import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("adds a participant to the list", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/insert a name/i), "Alice");
  await user.click(screen.getByRole("button", { name: /add/i }));

  expect(screen.getByText("Alice")).toBeInTheDocument();
});

test("shows a shuffled order list and clear button after sorting", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/insert a name/i), "Alice");
  await user.click(screen.getByRole("button", { name: /add/i }));
  await user.type(screen.getByPlaceholderText(/insert a name/i), "Bob");
  await user.click(screen.getByRole("button", { name: /add/i }));
  await user.click(screen.getByRole("button", { name: /shuffle/i }));

  expect(screen.getByRole("button", { name: /clear list/i })).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

test("clears the shuffled order list when a participant is removed", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/insert a name/i), "Alice");
  await user.click(screen.getByRole("button", { name: /add/i }));
  await user.type(screen.getByPlaceholderText(/insert a name/i), "Bob");
  await user.click(screen.getByRole("button", { name: /add/i }));
  await user.click(screen.getByRole("button", { name: /shuffle/i }));
  await user.click(screen.getAllByRole("button", { name: /remover/i })[0]);

  expect(screen.queryByRole("button", { name: /clear list/i })).not.toBeInTheDocument();
});
