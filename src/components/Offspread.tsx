import * as React from "react";

import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

import OffspreadItem from "./OffspreadItem";
import "./Offspread.css";

interface OffspreadProps {
  dimensions: any[];
  swapOffspread: Function,
  connectDropTarget: Function
}

class Offspread extends React.Component<OffspreadProps, {}> {
  render() {
    const { dimensions, swapOffspread } = this.props;
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="offspreads">
        {dimensions.map(d => <OffspreadItem key={d.name} dimension={d} swapOffspread={swapOffspread} />)}
      </div>
    );
  }
}

const targetSpec: DropTargetSpec = {
  drop(props) {
    return {
      obj: {
        type: "offspread"
      },
    };
  }
};

const targetCollector: DropTargetConnector = (
  connect: DropTargetConnector,
  monitor: DropTargetMonitor
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

export default DropTarget("header-node", targetSpec, targetCollector)(
  Offspread
);
