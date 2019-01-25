import { shallow } from "enzyme";
import React from "react";
import List from "../../../Components/Shared/List";
describe("List component", () => {
  const expectedList = ["home", "about"];
  const expectedStyles = { list: "test" };

  const comp = shallow(<List styles={expectedStyles} list={expectedList} />);
  it("Should render list passed in by props", () => {
    expect(comp.find("#li0").text()).toContain(expectedList[0]);
    expect(comp.find("#li1").text()).toContain(expectedList[1]);
  });
  it("Should have styles applied if injected in by props", () => {
    expect(comp.find("ul").prop("className")).toContain(expectedStyles.list);
  });
});
