import * as React from "react";

import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDropTarget
} from "react-dnd";

import ColumnHeaderDrop from "./ColumnHeaderDrop";

interface ColumnHeaderProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  connectDragPreview: Function;
  caption: string;
  style: React.CSSProperties;
  swapMember: Function;
  isDragging: boolean;
  isOver: boolean;
  dimension: any;
}

interface ColumnHeaderState {}

class ColumnHeader extends React.PureComponent<
  ColumnHeaderProps,
  ColumnHeaderState
> {
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
      dimension
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
        <ColumnHeaderDrop
          className="drop-left"
          caption={caption}
          dimension={dimension}
          before={true}
        />
        {caption}
        <ColumnHeaderDrop
          className="drop-right"
          caption={caption}
          dimension={dimension}
          before={false}
        />
      </div>
    );
  }
}

let sourceSpec: DragSourceSpec<ColumnHeaderProps> = {
  beginDrag: (props: ColumnHeaderProps) => ({
    obj: {
      type: "column",
      caption: props.caption
    },
    swapMember: props.swapMember
  }),

  endDrag(props: ColumnHeaderProps, monitor: DragSourceMonitor) {
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
  ColumnHeader
);
