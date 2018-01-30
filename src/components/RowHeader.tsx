import * as React from "react";
// import RowHeaderDrop from "./RowHeaderDrop";

import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDropTarget
} from "react-dnd";

import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

interface RowHeaderProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  connectDragPreview: Function;
  caption: string;
  style: React.CSSProperties;
  swapMember: Function;
  isDragging: boolean;
  isOver: boolean;
  dimension: any;
  row: any;
  clientOffset: any;
}

interface RowHeaderState {}

class RowHeader extends React.PureComponent<RowHeaderProps, RowHeaderState> {
  el: HTMLElement | null = null;

  state = {
    isLeft: false,
    isRight: false
  };

  componentDidMount() {
    const img = new Image();
    img.src = "http://netget.ca/wp-content/uploads/2016/10/cat-hungry-icon.png";
    img.onload = () => this.props.connectDragPreview(img);
  }

  render() {
    const {
      caption,
      style,
      connectDragSource,
      isDragging,
      isOver,
      connectDropTarget,
      clientOffset
      // dimension,
      // row
    } = this.props;

    const classes = ["header"];
    if (isOver) {
      classes.push("is-over");
    }
    if (isDragging) {
      classes.push("is-dragging");
    }

    if (isOver && clientOffset && this.el) {
      const { isRight, isLeft } = this.state;

      if (isRight) {
        classes.push("drop-right");
      } else if (isLeft) {
        classes.push("drop-left");
      } else {
        classes.push("drop-center");
      }
    }

    return connectDropTarget(
      connectDragSource(
        <div
          ref={el => (this.el = el)}
          className={classes.join(" ")}
          style={style}
        >
          {caption}
        </div>
      )
    );
  }
}

let sourceSpec: DragSourceSpec<RowHeaderProps> = {
  beginDrag: (props: RowHeaderProps) => ({
    obj: {
      type: "row",
      dimension: props.dimension,
      row: props.row,
      caption: props.caption
    },
    swapMember: props.swapMember
  }),

  endDrag(props: RowHeaderProps, monitor: DragSourceMonitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      item.swapMember(item.obj, dropResult.obj, dropResult.before);
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
  hover(props: any, monitor: DropTarget, component: any) {
    if (process.env.NODE_ENV === "production") {
      console.log(props, monitor);
    }

    const clientOffset = monitor.getClientOffset();
    const clientRect = component.el.getBoundingClientRect();
    const isLeft = clientOffset.x < clientRect.left + clientRect.width / 4;
    const isRight = clientOffset.x > clientRect.right - clientRect.width / 4;
    component.setState({ isLeft, isRight });
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

export default DragSource("header-node", sourceSpec, sourceCollector)(
  DropTarget("header-node", targetSpec, targetCollector)(RowHeader)
);
