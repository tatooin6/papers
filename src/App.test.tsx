import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("adds a participant to the list", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /agregar/i }));

  expect(screen.getByText("Alice")).toBeInTheDocument();
});

test("shows a shuffled order list and clear button after sorting", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /agregar/i }));
  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Bob");
  await user.click(screen.getByRole("button", { name: /agregar/i }));
  await user.click(screen.getByRole("button", { name: /mezclar/i }));

  expect(screen.getByRole("button", { name: /limpiar lista/i })).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

test("clears the shuffled order list when a participant is removed", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /agregar/i }));
  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Bob");
  await user.click(screen.getByRole("button", { name: /agregar/i }));
  await user.click(screen.getByRole("button", { name: /mezclar/i }));
  await user.click(
    screen.getAllByRole("button", { name: /eliminar participante/i })[0],
  );

  expect(screen.queryByRole("button", { name: /limpiar lista/i })).not.toBeInTheDocument();
});

test("uses Spanish by default", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /papelitos/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/idioma/i)).toHaveValue("es");
  expect(screen.getByText(/ingresa el nombre/i)).toBeInTheDocument();
  expect(screen.queryByText(/^idioma$/i)).not.toBeInTheDocument();
});

test("switches visible text to English", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.selectOptions(screen.getByLabelText(/idioma/i), "en");

  expect(screen.getByLabelText(/language/i)).toHaveValue("en");
  expect(screen.getByText(/insert a participant name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/insert a name/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /participants/i })).toBeInTheDocument();
});
