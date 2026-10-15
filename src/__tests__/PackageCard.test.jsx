import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PackageCard from "../components/PackageCard.jsx";

const pkg = {
  id: 1,
  title: "Goa Beach Getaway",
  destination: "Goa",
  type: "Beach",
  days: 4,
  rating: 4.5,
  pricePerPerson: 8500,
};

function renderCard(onSelectPackage = jest.fn()) {
  render(
    <MemoryRouter>
      <PackageCard pkg={pkg} onSelectPackage={onSelectPackage} />
    </MemoryRouter>
  );
  return onSelectPackage;
}

test("shows the package title, type, destination, days, rating and price", () => {
  renderCard();
  expect(screen.getByText("Goa Beach Getaway")).toBeInTheDocument();
  expect(screen.getByText("Beach")).toBeInTheDocument();
  expect(screen.getByText(/Goa • 4 days • ⭐ 4.5/)).toBeInTheDocument();
  expect(screen.getByText("₹8500 / person")).toBeInTheDocument();
});

test("links to the package detail page", () => {
  renderCard();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/package/1");
});

test("calls onSelectPackage with the package when View Details is clicked", async () => {
  const onSelectPackage = renderCard();
  await userEvent.click(screen.getByRole("button", { name: "View Details" }));
  expect(onSelectPackage).toHaveBeenCalledWith(pkg);
});
