import { shallow } from "enzyme";
import React from "react";
import Layout from "../../../Components/Layout/Layout";
import Banner from "../../../Components/Layout/Banner";

describe("layout component", () => {
  it("should render", () => {
    shallow(<Layout />);
  });
  it("should have a banner", () => {
    const comp = shallow(<Layout />);
    expect(comp.find(Banner)).toHaveLength(1);
  });
});
