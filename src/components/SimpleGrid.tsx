import * as React from "react";
import Stock from "./Stock";

interface SimpleGridProps {
  data: any[];
}

class SimpleGrid extends React.PureComponent<SimpleGridProps, {}> {
  render() {
    return (
      <div>
        This is a grid with {this.props.data.length} children
        <div className="grid">
          {this.props.data.map(stock => (
            <Stock key={stock._id.$oid} stock={stock} />
          ))}
        </div>
      </div>
    );
  }
}

export default SimpleGrid;
