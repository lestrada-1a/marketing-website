/**
 * Unit tests for the /seasonal-release/whats-new route page.
 *
 * Tests feature flag (whats_new_landing_page) behaviour:
 * - When flag is ON  → page renders the WhatsNewInFleetflow component
 * - When flag is OFF → notFound() is called (page returns 404)
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// ── Mocks ────────────────────────────────────────────────────────────────────

// next/navigation.notFound throws a special error in App Router.
// We mock it to capture calls and throw so we can test the behaviour.
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock the heavy WhatsNewInFleetflow component to keep this test focused.
jest.mock("@/app/components/WhatsNewInFleetflow", () => {
  const MockPage = () => (
    <main data-testid="whats-new-page">WhatsNewInFleetflow</main>
  );
  MockPage.displayName = "MockWhatsNewInFleetflow";
  return MockPage;
});

// Mock the featureFlags module so we can control the flag value per test.
jest.mock("@/app/lib/featureFlags", () => ({
  isFeatureEnabled: jest.fn(),
}));

// ── Import after mocks ────────────────────────────────────────────────────────
import WhatsNewPage from "../page";
import { isFeatureEnabled } from "@/app/lib/featureFlags";
import { notFound } from "next/navigation";

const mockIsFeatureEnabled = isFeatureEnabled as jest.Mock;
const mockNotFound = notFound as jest.Mock;

// ── Tests ─────────────────────────────────────────────────────────────────────
describe("WhatsNew route page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when whats_new_landing_page feature flag is ON", () => {
    beforeEach(() => {
      mockIsFeatureEnabled.mockReturnValue(true);
    });

    it("renders the WhatsNewInFleetflow page component", () => {
      render(<WhatsNewPage />);
      expect(screen.getByTestId("whats-new-page")).toBeInTheDocument();
    });

    it("does not call notFound()", () => {
      render(<WhatsNewPage />);
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it("passes the correct flag name to isFeatureEnabled", () => {
      render(<WhatsNewPage />);
      expect(mockIsFeatureEnabled).toHaveBeenCalledWith("whats_new_landing_page");
    });
  });

  describe("when whats_new_landing_page feature flag is OFF", () => {
    beforeEach(() => {
      mockIsFeatureEnabled.mockReturnValue(false);
    });

    it("calls notFound() and does not render the page", () => {
      expect(() => render(<WhatsNewPage />)).toThrow("NEXT_NOT_FOUND");
      expect(mockNotFound).toHaveBeenCalled();
    });
  });
});
