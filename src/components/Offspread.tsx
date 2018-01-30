import * as React from "react";

import "./Offspread.css";

interface OffspreadProps {
    dimensions: any[];
}

class Offspread extends React.Component<OffspreadProps, {}> {
  render() {
    const { dimensions } = this.props;

    console.table(dimensions);

    return (
      <div className="offspreads">
        {dimensions.map(d => (
          <span key={d.name} className="offspread">
            {d.name}
          </span>
        ))}
      </div>
    );
  }
}

export default Offspread;
