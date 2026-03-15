import { render, screen } from "@testing-library/react";
import { Notice } from "./Notice";

describe("Notice", () => {
  it("renders message with default tone", () => {
    render(<Notice message="Erreur test" />);
    expect(screen.getByText("Erreur test")).toBeInTheDocument();
  });

  it("renders success tone", () => {
    render(<Notice tone="success" message="Succes" />);
    const node = screen.getByText("Succes");
    expect(node).toBeInTheDocument();
    expect(node.className).toContain("border-emerald-200");
  });
});
