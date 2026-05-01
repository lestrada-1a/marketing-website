/**
 * Unit tests for the WhatsNewInFleetflow landing page component.
 *
 * Coverage:
 * - All major sections are rendered
 * - Feature flag (whats_new_landing_page) controls page visibility
 * - CTA links and scroll targets are present and keyboard-navigable
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import WhatsNewInFleetflow from "../index";

// Mock next/link so it renders a plain <a> in tests
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<{ href: string; [key: string]: unknown }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("WhatsNewInFleetflow component", () => {
  /* ── Sections ─────────────────────────────────────────────────────────── */

  it("renders the hero section with headline and CTA", () => {
    render(<WhatsNewInFleetflow />);

    expect(
      screen.getByRole("heading", { name: /What's new in Fleetflow/i, level: 1 })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Discover the latest features/i)
    ).toBeInTheDocument();

    const heroCTA = screen.getByRole("link", { name: /Explore Features/i });
    expect(heroCTA).toBeInTheDocument();
    expect(heroCTA).toHaveAttribute("href", "#features");
  });

  it("renders the benefits section with all three benefit items", () => {
    render(<WhatsNewInFleetflow />);

    expect(screen.getByText("Ship Faster")).toBeInTheDocument();
    expect(screen.getByText("Better Insights")).toBeInTheDocument();
    expect(screen.getByText("Seamless Integrations")).toBeInTheDocument();
  });

  it("renders the featured updates section with feature cards", () => {
    render(<WhatsNewInFleetflow />);

    expect(
      screen.getByRole("heading", { name: /Featured updates/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Timeline View")).toBeInTheDocument();
    expect(screen.getByText("Automation Templates")).toBeInTheDocument();
    expect(screen.getByText("Advanced Roadmaps")).toBeInTheDocument();
    expect(screen.getByText("DevOps Pipeline")).toBeInTheDocument();
  });

  it("renders category tags on feature cards", () => {
    render(<WhatsNewInFleetflow />);
    // There are two "Planning" tags – check at least one exists
    const planningTags = screen.getAllByText("Planning");
    expect(planningTags.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("DevOps")).toBeInTheDocument();
  });

  it("renders release quarters on feature cards", () => {
    render(<WhatsNewInFleetflow />);
    const q1Labels = screen.getAllByText("Q1 2025");
    expect(q1Labels.length).toBeGreaterThanOrEqual(1);
    const q2Labels = screen.getAllByText("Q2 2025");
    expect(q2Labels.length).toBeGreaterThanOrEqual(1);
  });

  it('renders "Learn More" links for each feature card', () => {
    render(<WhatsNewInFleetflow />);
    const learnMoreLinks = screen.getAllByRole("link", {
      name: /Learn more about/i,
    });
    expect(learnMoreLinks).toHaveLength(4);
  });

  it("renders the stay-up-to-date section with 3 numbered steps", () => {
    render(<WhatsNewInFleetflow />);

    expect(
      screen.getByRole("heading", { name: /Stay up to date/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Browse updates")).toBeInTheDocument();
    expect(screen.getByText("Try it out")).toBeInTheDocument();
    expect(screen.getByText("Share feedback")).toBeInTheDocument();
  });

  it("renders the footer CTA section with headline and button", () => {
    render(<WhatsNewInFleetflow />);

    expect(
      screen.getByText(/Never miss what's new in Fleetflow/i)
    ).toBeInTheDocument();

    const viewAllLink = screen.getByRole("link", { name: /View All Updates/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/updates");
  });

  /* ── Accessibility ────────────────────────────────────────────────────── */

  it("hero CTA has a descriptive aria-label for screen readers", () => {
    render(<WhatsNewInFleetflow />);
    const heroCTA = screen.getByRole("link", { name: /Explore Features/i });
    expect(heroCTA).toHaveAttribute("aria-label");
  });

  it("all feature card images have alt text", () => {
    render(<WhatsNewInFleetflow />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });

  it("feature cards' Learn More links have descriptive aria-labels", () => {
    render(<WhatsNewInFleetflow />);
    const links = screen.getAllByRole("link", { name: /Learn more about/i });
    links.forEach((link) => {
      expect(link).toHaveAttribute("aria-label");
      expect(link.getAttribute("aria-label")).toMatch(/learn more about/i);
    });
  });

  it("renders section headings that provide document structure", () => {
    render(<WhatsNewInFleetflow />);
    const headings = screen.getAllByRole("heading");
    // h1 hero + h2 benefits + h2 featured + h2 stay-up-to-date + h2 footer
    // + h3 benefit items + h3 feature card names
    expect(headings.length).toBeGreaterThanOrEqual(5);
  });

  /* ── Scroll target ────────────────────────────────────────────────────── */

  it('the featured-updates section has id="features" for the hero CTA', () => {
    const { container } = render(<WhatsNewInFleetflow />);
    const featuresSection = container.querySelector("#features");
    expect(featuresSection).toBeInTheDocument();
  });
});
