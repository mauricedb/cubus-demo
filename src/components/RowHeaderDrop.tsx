import * as React from "react";

import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

class RowHeaderDrop extends React.Component<any, any> {
  el;

  render() {
    const { connectDropTarget, isOver } = this.props;

    const classes = [this.props.className];
    if (isOver) {
      classes.push("is-over");
    }

    return connectDropTarget(
      <span ref={el => (this.el = el)} className={classes.join(" ")} />
    );
  }
}

const targetSpec: DropTargetSpec = {
  hover(props: any, monitor: DropTarget, component: any) {
    if (process.env.NODE_ENV === "production") {
      console.log(props, monitor);
    }
  },
  drop(props, monitor, component) {
    const clientOffset = monitor.getClientOffset();
    const clientRect = component.el.getBoundingClientRect();
    const isTop = clientOffset.y < clientRect.top + clientRect.height / 2;
    const isLeft = clientOffset.x < clientRect.left + clientRect.width / 4;
    const isRight = clientOffset.x > clientRect.right - clientRect.width / 4;
    return {
      obj: {
        caption: props.caption,
        dimension: props.dimension,
        row: props.row,
        type: "row",
        isTop,
        isLeft,
        isRight
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
  canDrop: monitor.canDrop(),
  clientOffset: monitor.getClientOffset()
});

export default DropTarget("header-node", targetSpec, targetCollector)(
  RowHeaderDrop
);
