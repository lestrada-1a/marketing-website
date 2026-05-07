import { render, screen } from "@testing-library/react";
import WhatsNewPage from "@/app/components/WhatsNew/WhatsNewPage";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function renderPage() {
  return render(<WhatsNewPage />);
}

// ──────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────

describe("WhatsNewPage", () => {
  describe("Hero section", () => {
    it("renders the hero headline", () => {
      renderPage();
      expect(
        screen.getByRole("heading", { name: /what's new in fleetflow/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("renders the hero sub-text", () => {
      renderPage();
      expect(
        screen.getByText(/discover the latest features/i)
      ).toBeInTheDocument();
    });

    it("renders the Explore Features CTA that links to the features section", () => {
      renderPage();
      const link = screen.getByRole("link", { name: /explore features/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#featured-updates");
    });

    it("renders the hero banner image with alt text", () => {
      renderPage();
      const img = screen.getByAltText(/what's new in fleetflow/i);
      expect(img).toBeInTheDocument();
    });
  });

  describe("Benefits section", () => {
    it("renders the Ship Faster benefit", () => {
      renderPage();
      expect(screen.getByText("Ship Faster")).toBeInTheDocument();
    });

    it("renders the Better Insights benefit", () => {
      renderPage();
      expect(screen.getByText("Better Insights")).toBeInTheDocument();
    });

    it("renders the Seamless Integrations benefit", () => {
      renderPage();
      expect(screen.getByText("Seamless Integrations")).toBeInTheDocument();
    });
  });

  describe("Featured Updates section", () => {
    it("renders the Featured Updates heading", () => {
      renderPage();
      expect(
        screen.getByRole("heading", { name: /featured updates/i })
      ).toBeInTheDocument();
    });

    it("renders at least 3 feature cards", () => {
      renderPage();
      const learnMoreLinks = screen.getAllByRole("link", {
        name: /learn more about/i,
      });
      expect(learnMoreLinks.length).toBeGreaterThanOrEqual(3);
    });

    it("renders the Task View feature card", () => {
      renderPage();
      expect(screen.getByText("Task View")).toBeInTheDocument();
    });

    it("renders the Templates feature card", () => {
      renderPage();
      expect(screen.getByText("Templates")).toBeInTheDocument();
    });

    it("renders the Advanced Map View feature card", () => {
      renderPage();
      expect(screen.getByText("Advanced Map View")).toBeInTheDocument();
    });

    it("renders category tags on feature cards", () => {
      renderPage();
      expect(screen.getAllByText("Planning").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Automation")).toBeInTheDocument();
      expect(screen.getByText("DevOps")).toBeInTheDocument();
    });

    it("each Learn More link is keyboard-navigable (has href)", () => {
      renderPage();
      const links = screen.getAllByRole("link", { name: /learn more about/i });
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
      });
    });
  });

  describe("Stay Up to Date section", () => {
    it("renders the Stay Up to Date heading", () => {
      renderPage();
      expect(
        screen.getByRole("heading", { name: /stay up to date/i })
      ).toBeInTheDocument();
    });

    it("renders the Browse updates step", () => {
      renderPage();
      expect(screen.getByText("Browse updates")).toBeInTheDocument();
    });

    it("renders the Try it out step", () => {
      renderPage();
      expect(screen.getByText("Try it out")).toBeInTheDocument();
    });

    it("renders the Share feedback step", () => {
      renderPage();
      expect(screen.getByText("Share feedback")).toBeInTheDocument();
    });
  });

  describe("Footer CTA section", () => {
    it("renders the footer CTA headline", () => {
      renderPage();
      expect(
        screen.getByRole("heading", {
          name: /never miss what's new in fleetflow/i,
        })
      ).toBeInTheDocument();
    });

    it("renders the View All Updates CTA button that links to /updates", () => {
      renderPage();
      const link = screen.getByRole("link", { name: /view all updates/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/updates");
    });
  });
});
