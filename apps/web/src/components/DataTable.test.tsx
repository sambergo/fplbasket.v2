import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  const rows = [{ name: "Saka" }, { name: "Haaland" }];
  const columns = [{ accessorKey: "name", header: "Player" }];

  it("filters and clears rows accessibly", () => {
    render(<DataTable data={rows} columns={columns} filterPlaceholder="Search players" />);
    fireEvent.change(screen.getByLabelText("Search players"), { target: { value: "Saka" } });
    expect(screen.getByText("Saka")).toBeVisible();
    expect(screen.queryByText("Haaland")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(screen.getByText("Haaland")).toBeVisible();
  });
});
