import { shallow } from "enzyme";
import React from "react";
import Layout from "../../../Components/Layout/Layout";
import Section from "../../../Components/Layout/Section";
import Nav from "../../../Components/Layout/Nav";
import LinkedInBubble from "../../../Components/Layout/LinkedInBubble";
import backgroundImg from "../../../Assets/Images/Cribbar2.JPG";

describe("layout component", () => {
  const comp = shallow(<Layout />);

  it("should have id for home navigation", () => {
    expect(comp.find("#home")).toHaveLength(1);
  });
  it("should have a section and injected image style", () => {
    expect(comp.find(Section)).toHaveLength(1);
    expect(comp.find(Section).prop("backgroundStyle")).toEqual({
      backgroundImage: "url('" + backgroundImg + "')"
    });
  });
  it("should have section containing navigation menu", () => {
    expect(comp.find(Section).find(Nav)).toHaveLength(1);
  });
  it("should have linked in bubble", () => {
    expect(comp.find(LinkedInBubble)).toHaveLength(1);
  });
});
