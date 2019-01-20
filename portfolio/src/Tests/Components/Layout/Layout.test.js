import { shallow } from "enzyme";
import React from "react";
import Layout from "../../../Components/Layout/Layout";
import Banner from "../../../Components/Layout/Banner";
import Nav from "../../../Components/Layout/Nav";
import LinkedInBubble from "../../../Components/Layout/LinkedInBubble";
import backgroundImg from "../../../Assets/Images/Cribbar2.JPG";

describe("layout component", () => {
  const comp = shallow(<Layout />);

  it("should have id for home navigation", () => {
    expect(comp.find("#home")).toHaveLength(1);
  });
  it("should have a banner and inject image source", () => {
    expect(comp.find(Banner)).toHaveLength(1);
    expect(comp.find(Banner).prop("imgSrc")).toBe(backgroundImg);
  });
  it("should have navigation menu", () => {
    expect(comp.find(Nav)).toHaveLength(1);
  });
  it("should have linked in bubble", () => {
    expect(comp.find(LinkedInBubble)).toHaveLength(1);
  });
});
