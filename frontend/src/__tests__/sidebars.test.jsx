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
    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith("/posts/trending/");
      expect(API.get).toHaveBeenCalledWith("/tags/");
      expect(API.get).toHaveBeenCalledWith("/users/suggested/");
    });
    expect(screen.getByText(/Trending Posts/i)).toBeInTheDocument();
  });

  test("renders right sidebar sections", async () => {
    render(<RightSidebar mobileOpen={false} setMobileOpen={() => {}} />);
    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith("/profile/stats/");
      expect(API.get).toHaveBeenCalledWith("/bookmarks/");
      expect(API.get).toHaveBeenCalledWith("/notifications/");
    });
    expect(screen.getByText(/My Activity/i)).toBeInTheDocument();
  });
});
