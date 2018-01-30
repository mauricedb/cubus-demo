import * as React from "react";

import OffspreadItem from "./OffspreadItem";
import "./Offspread.css";

interface OffspreadProps {
  dimensions: any[];
  swapOffspread: Function
}

class Offspread extends React.Component<OffspreadProps, {}> {
  render() {
    const { dimensions, swapOffspread } = this.props;

    return (
      <div className="offspreads">
        {dimensions.map(d => <OffspreadItem key={d.name} dimension={d} swapOffspread={swapOffspread} />)}
      </div>
    );
  }
}

export default Offspread;
