import * as React from "react";
import RowHeaderDrop from "./RowHeaderDrop";

import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDropTarget
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
}

interface RowHeaderState {}

class RowHeader extends React.PureComponent<RowHeaderProps, RowHeaderState> {
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
      isOver
    } = this.props;

    const classes = ["header"];
    if (isOver) {
      classes.push("is-over");
    }
    if (isDragging) {
      classes.push("is-dragging");
    }
    return connectDragSource(
      <div className={classes.join(" ")} style={style}>
        <RowHeaderDrop className="drop-top" caption={caption} before={true} />
        {caption}
        <RowHeaderDrop
          className="drop-bottom"
          caption={caption}
          before={false}
        />
      </div>
    );
  }
}

let sourceSpec: DragSourceSpec<RowHeaderProps> = {
  beginDrag: (props: RowHeaderProps) => ({
    obj: {
      type: "row",
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

export default DragSource("header-node", sourceSpec, sourceCollector)(
  RowHeader
);
