import { shallow } from "enzyme";
import React from "react";
import Layout from "../../../Components/Layout/Layout";
import Banner from "../../../Components/Layout/Banner";
import Nav from "../../../Components/Layout/Nav";

describe("layout component", () => {
  const comp = shallow(<Layout />);

  it("should have a banner", () => {
    expect(comp.find(Banner)).toHaveLength(1);
  });
  it("should have navigation menu", () => {
    expect(comp.find(Nav)).toHaveLength(1);
  });
});
