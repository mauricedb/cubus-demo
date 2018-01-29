import * as React from "react";

import {
  ConnectDragSource,
  // DragDropContext,
  DragSource,
  DragSourceSpec,
  // DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  // DragElementWrapper,
  ConnectDropTarget,
  DropTarget
  // DropTargetConnector,
  // DropTargetMonitor,
  // ClientOffset,
  // DropTargetSpec
} from "react-dnd";

// import * as ReactDnD from "react-dnd";

// const ReactDnD = require('react-dnd');

interface GridHeaderProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  caption: string;
  style: React.CSSProperties;
  swapMember: Function;
}

interface GridHeaderState {}

let nodeSourceSpec: DragSourceSpec<GridHeaderProps> = {
  beginDrag: (props: GridHeaderProps) => ({
    caption: props.caption,
    swapMember: props.swapMember
  }),

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      console.log(`You dropped ${item.caption} into ${dropResult.caption}!`); // eslint-disable-line no-alert
      item.swapMember(item.caption, dropResult.caption);
    }
  }
};

// Collect: Put drag state into props
let nodeSourceCollector = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor
) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

// @DragSource("new-node", nodeSourceSpec, nodeSourceCollector)
class GridHeader extends React.PureComponent<GridHeaderProps, GridHeaderState> {
  render() {
    const { caption, style } = this.props;
    const { connectDragSource, connectDropTarget } = this.props;

    return connectDropTarget(
      connectDragSource(
        <div className="header" style={style}>
          {caption}
        </div>
      )
    );
  }
}

const boxTarget = {
  drop(props) {
    return { caption: props.caption };
  }
};

export default DropTarget("new-node", boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(DragSource("new-node", nodeSourceSpec, nodeSourceCollector)(GridHeader));
// export default  GridHeader;
