import { render, screen } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("adds a participant to the list", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));

  expect(screen.getByText("Alice")).toBeInTheDocument();
});

test("shows a shuffled order list and clear button after sorting", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));
  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Bob");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));
  await user.click(screen.getByRole("button", { name: /mezclar/i }));

  expect(screen.getByRole("button", { name: /limpiar lista/i })).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

test("clears the shuffled order list when a participant is removed", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));
  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Bob");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));
  await user.click(screen.getByRole("button", { name: /mezclar/i }));
  await user.click(
    screen.getAllByRole("button", { name: /eliminar participante/i })[0],
  );

  expect(screen.queryByRole("button", { name: /limpiar lista/i })).not.toBeInTheDocument();
});

test("uses Spanish by default", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /papelitos/i })).toBeInTheDocument();
  expect(screen.getByText(/ingresa el nombre/i)).toBeInTheDocument();
  expect(screen.queryByText(/^idioma$/i)).not.toBeInTheDocument();
});

test("switches visible text to English", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole("button", { name: /configuracion/i }));
  await user.selectOptions(screen.getByLabelText(/idioma/i), "en");

  expect(screen.getByLabelText(/language/i)).toHaveValue("en");
  expect(screen.getByText(/insert a participant name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/insert a name/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /participants/i })).toBeInTheDocument();
});

test("disables moving a straggler when there are no stragglers", () => {
  render(<App />);

  expect(
    screen.getByRole("button", { name: /mover rezagado a participantes/i }),
  ).toBeDisabled();
});

test("warns when adding a duplicate name", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));
  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "alice");
  await user.click(screen.getByRole("button", { name: /^agregar$/i }));

  expect(screen.getByText(/alice ya existe/i)).toBeInTheDocument();
});

test("shows a suspense countdown before shuffling", async () => {
  jest.useFakeTimers();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  try {
    render(<App />);

    await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
    await user.click(screen.getByRole("button", { name: /^agregar$/i }));
    await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Bob");
    await user.click(screen.getByRole("button", { name: /^agregar$/i }));
    await user.click(screen.getByRole("button", { name: /configuracion/i }));
    await user.click(screen.getByRole("button", { name: /activar suspenso/i }));
    await user.click(screen.getByRole("button", { name: /listo/i }));
    await user.click(screen.getByRole("button", { name: /mezclar/i }));

    expect(screen.getByText(/mezclando en 5 segundos/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByRole("button", { name: /limpiar lista/i })).toBeInTheDocument();
  } finally {
    jest.useRealTimers();
  }
});

test("reorders stragglers and disables edge movement", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Alice");
  await user.click(screen.getByRole("button", { name: /rezagar/i }));
  await user.type(screen.getByPlaceholderText(/ingresa un nombre/i), "Bob");
  await user.click(screen.getByRole("button", { name: /rezagar/i }));

  expect(screen.getByRole("button", { name: /mover alice hacia arriba/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /mover bob hacia abajo/i })).toBeDisabled();

  await user.click(screen.getByRole("button", { name: /mover bob hacia arriba/i }));

  const stragglers = screen.getAllByRole("listitem");
  expect(stragglers[0]).toHaveTextContent("Bob");
  expect(stragglers[1]).toHaveTextContent("Alice");
});
