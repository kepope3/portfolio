import { shallow } from "enzyme";
import React from "react";
import LinkedInBubble from "../../../Components/Layout/LinkedInBubble";
describe("LinkedInBubble component", () => {
  it("Should have link to linked in", () => {
    const comp = shallow(<LinkedInBubble />);
    expect(comp.find("#link")).toHaveLength(1);
  });
});
