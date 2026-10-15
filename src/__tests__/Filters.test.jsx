import { render, screen, renderHook, act, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import FilterPanel from "../components/FilterPanel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import PackageList from "../components/PackageList.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { usePackages } from "../hooks/usePackages.js";
import { fetchPackages } from "../api/packagesApi.js";

jest.mock("../context/BookingContext.jsx", () => ({ useBooking: jest.fn() }));
jest.mock("../api/packagesApi.js", () => ({ fetchPackages: jest.fn() }));
jest.mock("../api/client.js", () => ({
  getErrorMessage: (err) => err.message,
  isCanceled: () => false,
}));

const emptyFilters = { type: "", duration: "", budget: "", minRating: "" };

const goa = { id: 1, title: "Goa Beach Getaway", destination: "Goa", type: "Beach", days: 4, rating: 4.5, pricePerPerson: 8500 };
const manali = { id: 2, title: "Manali Mountain Escape", destination: "Manali", type: "Mountain", days: 5, rating: 4.7, pricePerPerson: 12000 };

describe("FilterPanel", () => {
  const setFilters = jest.fn();

  beforeEach(() => {
    setFilters.mockClear();
    useBooking.mockReturnValue({ filters: emptyFilters, setFilters });
  });

  test("selecting a budget updates the budget filter", async () => {
    render(<FilterPanel />);
    await userEvent.selectOptions(screen.getByDisplayValue("Any Budget"), "0-10000");
    expect(setFilters).toHaveBeenCalledWith({ ...emptyFilters, budget: "0-10000" });
  });

  test("selecting a type keeps the other filters", async () => {
    useBooking.mockReturnValue({ filters: { ...emptyFilters, budget: "0-10000" }, setFilters });
    render(<FilterPanel />);
    await userEvent.selectOptions(screen.getByDisplayValue("All Types"), "Beach");
    expect(setFilters).toHaveBeenCalledWith({ ...emptyFilters, budget: "0-10000", type: "Beach" });
  });

  test("selecting a duration and a rating updates those filters", async () => {
    render(<FilterPanel />);
    await userEvent.selectOptions(screen.getByDisplayValue("Any Duration"), "4-5");
    expect(setFilters).toHaveBeenCalledWith({ ...emptyFilters, duration: "4-5" });
    await userEvent.selectOptions(screen.getByDisplayValue("Any Rating"), "4.5");
    expect(setFilters).toHaveBeenCalledWith({ ...emptyFilters, minRating: "4.5" });
  });
});

describe("SearchBar", () => {
  test("typing a destination calls setSearch", () => {
    const setSearch = jest.fn();
    useBooking.mockReturnValue({ search: "", setSearch });
    render(<SearchBar />);
    fireEvent.change(screen.getByPlaceholderText(/Search destination/), { target: { value: "Goa" } });
    expect(setSearch).toHaveBeenCalledWith("Goa");
  });
});

describe("PackageList", () => {
  function renderList(state) {
    useBooking.mockReturnValue({ selectPackage: jest.fn(), hasActiveFilters: false, ...state });
    render(
      <MemoryRouter>
        <PackageList />
      </MemoryRouter>
    );
  }

  test("shows a card for every package", () => {
    renderList({ packages: [goa, manali] });
    expect(screen.getByText("Goa Beach Getaway")).toBeInTheDocument();
    expect(screen.getByText("Manali Mountain Escape")).toBeInTheDocument();
  });

  test("shows a filter message when nothing matches", () => {
    renderList({ packages: [], hasActiveFilters: true });
    expect(screen.getByText(/No travel packages found/)).toBeInTheDocument();
  });

  test("shows a plain message when there are no packages and no filters", () => {
    renderList({ packages: [] });
    expect(screen.getByText("No packages available.")).toBeInTheDocument();
  });
});

describe("usePackages", () => {
  beforeEach(() => {
    fetchPackages.mockReset();
    fetchPackages.mockResolvedValue([goa]);
  });

  test("loads all packages first", async () => {
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.packages).toEqual([goa]));
    expect(fetchPackages.mock.calls[0][0]).toEqual({
      destination: "",
      type: "",
      duration: "",
      budget: "",
      rating: "",
    });
  });

  test("sends the budget filter to the API", async () => {
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setFilters({ ...emptyFilters, budget: "0-10000" }));

    await waitFor(() =>
      expect(fetchPackages).toHaveBeenLastCalledWith(
        expect.objectContaining({ budget: "0-10000" }),
        expect.anything()
      )
    );
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test("sends the destination search to the API after typing stops", async () => {
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setSearch("Goa"));

    await waitFor(() =>
      expect(fetchPackages).toHaveBeenLastCalledWith(
        expect.objectContaining({ destination: "Goa" }),
        expect.anything()
      )
    );
  });

  test("keeps the packages empty and sets an error when the API fails", async () => {
    fetchPackages.mockRejectedValue(new Error("Server down"));
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.error).toBe("Server down"));
    expect(result.current.packages).toEqual([]);
  });
});
