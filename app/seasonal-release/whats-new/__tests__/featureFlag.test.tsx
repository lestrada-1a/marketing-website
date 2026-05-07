/**
 * Tests for the feature-flag-gated page.tsx route component.
 *
 * Because page.tsx calls next/navigation's `notFound()` when the flag is off,
 * and because next/jest stubs that module, we test by inspecting whether
 * notFound was called rather than checking for a 404 page.
 */
import { render, screen } from "@testing-library/react";

// Mock next/navigation so notFound() throws (as it does in production Next.js)
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock the WhatsNewPage component to keep this test focused on flag behaviour
jest.mock("@/app/components/WhatsNew/WhatsNewPage", () => ({
  __esModule: true,
  default: () => <div data-testid="whats-new-page">WhatsNew Content</div>,
}));

import { notFound } from "next/navigation";
import WhatsNewInFleetflowPage from "@/app/seasonal-release/whats-new/page";

const mockedNotFound = notFound as jest.Mock;

describe("WhatsNew route page.tsx – feature flag", () => {
  beforeEach(() => {
    mockedNotFound.mockClear();
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_FEATURE_WHATS_NEW_LANDING_PAGE;
  });

  it("calls notFound() and does not render the page when flag is off", () => {
    process.env.NEXT_PUBLIC_FEATURE_WHATS_NEW_LANDING_PAGE = "false";
    expect(() => render(<WhatsNewInFleetflowPage />)).toThrow("NEXT_NOT_FOUND");
    expect(mockedNotFound).toHaveBeenCalled();
  });

  it("calls notFound() when flag env var is absent", () => {
    delete process.env.NEXT_PUBLIC_FEATURE_WHATS_NEW_LANDING_PAGE;
    expect(() => render(<WhatsNewInFleetflowPage />)).toThrow("NEXT_NOT_FOUND");
    expect(mockedNotFound).toHaveBeenCalled();
  });

  it("renders the page when flag is on", () => {
    process.env.NEXT_PUBLIC_FEATURE_WHATS_NEW_LANDING_PAGE = "true";
    render(<WhatsNewInFleetflowPage />);
    expect(mockedNotFound).not.toHaveBeenCalled();
    expect(screen.getByTestId("whats-new-page")).toBeInTheDocument();
  });
});
