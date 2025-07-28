import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import API from "../api";

jest.mock("../api");

describe("Sidebar components", () => {
  beforeEach(() => {
    API.get.mockResolvedValue({ data: { results: [] } });
  });

  test("renders left sidebar sections", async () => {
    render(<LeftSidebar mobileOpen={false} setMobileOpen={() => {}} />);
    expect(screen.getByText(/Trending Posts/i)).toBeInTheDocument();
    await waitFor(() => expect(API.get).toHaveBeenCalled());
  });

  test("renders right sidebar sections", async () => {
    render(<RightSidebar mobileOpen={false} setMobileOpen={() => {}} />);
    expect(screen.getByText(/My Activity/i)).toBeInTheDocument();
    await waitFor(() => expect(API.get).toHaveBeenCalled());
  });
});
