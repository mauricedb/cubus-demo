import * as React from "react";

import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDropTarget,
} from "react-dnd";

import GridHeaderDrop from './GridHeaderDrop';


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
        <GridHeaderDrop className="drop-left" caption={caption} before={true} />
        {caption}
        <GridHeaderDrop
          className="drop-right"
          caption={caption}
          before={false}
        />
      </div>
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
      item.swapMember(item.caption, dropResult.caption, dropResult.before);
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
  GridHeader
);
