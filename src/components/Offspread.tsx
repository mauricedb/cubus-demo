import * as React from "react";

import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

import AppState from "../AppState";

import OffspreadItem from "./OffspreadItem";
import "./Offspread.css";

interface OffspreadProps {
  dimensions: any[];
  swapOffspread: Function;
  connectDropTarget: Function;
  isOver: boolean;
  appState: AppState;
}

class Offspread extends React.Component<OffspreadProps, {}> {
  render() {
    const { dimensions, swapOffspread, isOver, appState } = this.props;
    const { connectDropTarget } = this.props;

    const classes = ["offspreads"];
    if (isOver) {
      classes.push("is-over");
    }

    if (appState === AppState.design) {
      classes.push("design-mode");
    }

    const markup = (
      <div className={classes.join(" ")}>
        {dimensions.map(d => (
          <OffspreadItem
            appState={appState}
            key={d.name}
            dimension={d}
            swapOffspread={swapOffspread}
          />
        ))}
      </div>
    );

    if (appState == AppState.view) {
      return markup;
    }
    return connectDropTarget(markup);
  }
}

const targetSpec: DropTargetSpec = {
  drop(props) {
    return {
      obj: {
        type: "offspread"
      }
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
