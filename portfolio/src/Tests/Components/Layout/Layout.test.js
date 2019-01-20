import { shallow } from "enzyme";
import React from "react";
import Layout from "../../../Components/Layout/Layout";
import Banner from "../../../Components/Layout/Banner";
import Nav from "../../../Components/Layout/Nav";
import LinkedInBubble from "../../../Components/Layout/LinkedInBubble";

describe("layout component", () => {
  const comp = shallow(<Layout />);

  it("should have id for home navigation", () => {
    expect(comp.find("#home")).toHaveLength(1);
  });
  it("should have a banner", () => {
    expect(comp.find(Banner)).toHaveLength(1);
  });
  it("should have navigation menu", () => {
    expect(comp.find(Nav)).toHaveLength(1);
  });
  it("should have linked in bubble", () => {
    expect(comp.find(LinkedInBubble)).toHaveLength(1);
  });
});
