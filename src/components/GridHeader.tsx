import * as React from "react";

import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  // DragElementWrapper,
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  // ClientOffset,
  DropTargetSpec
} from "react-dnd";

// import * as ReactDnD from "react-dnd";

// const ReactDnD = require('react-dnd');

interface GridHeaderProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  connectDragPreview: Function;
  caption: string;
  style: React.CSSProperties;
  swapMember: Function;
  isDragging: boolean;
  isOver: boolean;
}

interface GridHeaderState {}

class GridHeader extends React.PureComponent<GridHeaderProps, GridHeaderState> {
  componentDidMount() {
    const img = new Image();
    img.src = 'http://netget.ca/wp-content/uploads/2016/10/cat-hungry-icon.png'
    img.onload = () => this.props.connectDragPreview(img);
  }

  render() {
    const { caption, style } = this.props;
    const { connectDragSource, connectDropTarget } = this.props;
    const { isDragging, isOver } = this.props;

    const classes = ["header"];
    if (isOver) {
      classes.push("is-over");
    }
    if (isDragging) {
      classes.push("is-dragging");
    }
    return connectDropTarget(
      connectDragSource(
        <div className={classes.join(" ")} style={style}>
          {caption}
        </div>
      )
    );
  }
}

let sourceSpec: DragSourceSpec<GridHeaderProps> = {
  beginDrag: (props: GridHeaderProps) => ({
    caption: props.caption,
    swapMember: props.swapMember
  }),

  endDrag(props: GridHeaderProps, monitor: DragSourceMonitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      item.swapMember(item.caption, dropResult.caption);
    }
  }
};

// Collect: Put drag state into props
let sourceCollector: DragSourceCollector = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor
) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  };
};

const targetSpec: DropTargetSpec = {
  drop(props: GridHeaderProps) {
    return { caption: props.caption };
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
  DragSource("header-node", sourceSpec, sourceCollector)(GridHeader)
);
