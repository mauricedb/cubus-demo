import * as React from "react";

import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

class ColumnHeaderDrop extends React.Component<any, any> {
  render() {
    const { connectDropTarget, isOver } = this.props;

    const classes = [this.props.className];
    if (isOver) {
      classes.push("is-over");
    }

    return connectDropTarget(<span className={classes.join(" ")} />);
  }
}

const targetSpec: DropTargetSpec = {
  hover(props: any, monitor: DropTarget, component: any) {
    if (process.env.NODE_ENV === "production") {
      console.log(props, monitor);
    }
  },
  drop(props) {
    return {
      obj: {
        caption: props.caption,
        dimension: props.dimension,
        column: props.column,
        type: "column"
      },
      before: props.before
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
  ColumnHeaderDrop
);
