// Auth.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Auth from "../components/Auth";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

// Smoke Test
it("renders without crashing", () => {
  render(<Auth />);
});

// Snapshot Test
it("matches snapshot", () => {
  const { asFragment } = render(<Auth />);
  expect(asFragment()).toMatchSnapshot();
});

// Interaction Test: Input Fields
it("allows entering email and password", () => {
  render(<Auth />);

  fireEvent.change(screen.getByPlaceholderText("email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("password"), {
    target: { value: "password" },
  });

  expect(screen.getByPlaceholderText("email").value).toBe("test@example.com");
  expect(screen.getByPlaceholderText("password").value).toBe("password");
});

// Interaction Test: Form Submission
it("submits the form with email and password", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({ email: "test@example.com", token: "fake_token" })
  );

  render(<Auth />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText("email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("password"), {
    target: { value: "password" },
  });

  // Simulate form submission
  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  // Check if fetch was called with correct arguments
  expect(fetch).toHaveBeenCalledWith(
    `${process.env.REACT_APP_SERVER_URL}/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password" }),
    }
  );
});
