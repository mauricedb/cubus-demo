import * as React from "react";

import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

class RowHeaderDrop extends React.Component<any, any> {
  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(<span className={this.props.className} />);
  }
}

const targetSpec: DropTargetSpec = {
  hover(props: any, monitor: DropTarget, component: any) {
    console.log(props, monitor);
    if (process.env.NODE_ENV === "production") {
      console.log(props, monitor);
    }
  },
  drop(props) {
    return {
      obj: {
        caption: props.caption,
        type: "row"
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
  RowHeaderDrop
);
