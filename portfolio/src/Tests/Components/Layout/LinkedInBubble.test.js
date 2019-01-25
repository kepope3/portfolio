import { shallow } from "enzyme";
import React from "react";
import LinkedInBubble from "../../../Components/Layout/LinkedInBubble";
describe("LinkedInBubble component", () => {
  it("Should have link to linked in", () => {
    const expectedLink = "https://www.linkedin.com/in/keith-pope-a83b01133";

    const comp = shallow(<LinkedInBubble />);
    expect(comp.find("a").prop("href")).toBe(expectedLink);
  });
  it("should have img and i tag", () => {
    const comp = shallow(<LinkedInBubble />);
    expect(comp.find("img")).toHaveLength(1);
    expect(comp.find("i")).toHaveLength(1);
  });
});
