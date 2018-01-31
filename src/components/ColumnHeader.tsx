import * as React from "react";

import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";

import AppState from "../AppState";
import ColumnHeaderDrop from "./ColumnHeaderDrop";
import Splitter from "./Splitter";

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
  column: any;
  appState: AppState;
  updateColumnWidth: Function;
  columnIndex: number
}

interface ColumnHeaderState {}

class ColumnHeader extends React.PureComponent<
  ColumnHeaderProps,
  ColumnHeaderState
> {
  el: any = null;

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
      dimension,
      column,
      appState,
      connectDropTarget,
      updateColumnWidth,
    } = this.props;

    const classes = ["header"];
    if (isOver) {
      classes.push("is-over");
    }
    if (isDragging) {
      classes.push("is-dragging");
    }

    const markup = connectDropTarget(
      <div
        ref={el => (this.el = el)}
        className={classes.join(" ")}
        style={style}
      >
        <ColumnHeaderDrop
          className="drop-left"
          caption={caption}
          dimension={dimension}
          column={column}
          before={true}
        />
        {caption}

        <Splitter updateColumnWidth={updateColumnWidth} />

        <ColumnHeaderDrop
          className="drop-right"
          caption={caption}
          dimension={dimension}
          column={column}
          before={false}
        />
      </div>
    );

    if (appState == AppState.view) {
      return markup;
    }

    return connectDragSource(markup);
  }
}

let sourceSpec: DragSourceSpec<ColumnHeaderProps> = {
  beginDrag: (props: ColumnHeaderProps) => ({
    obj: {
      type: "column",
      dimension: props.dimension,
      column: props.column,
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

const targetSpec: DropTargetSpec = {
  hover(props, monitor, component){
    const differenceFromInitialOffset = monitor.getDifferenceFromInitialOffset();
    console.log('hover', differenceFromInitialOffset)
  },

  drop(props, monitor, component) {
    const differenceFromInitialOffset = monitor.getDifferenceFromInitialOffset();
    const columnIndex = props.columnIndex - 1;

    return {
      obj: {
        differenceFromInitialOffset,
        columnIndex
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

targetSpec.toString();
targetCollector.toString();

// export default DragSource("header-node", sourceSpec, sourceCollector)(ColumnHeader)

export default DragSource("header-node", sourceSpec, sourceCollector)(
  DropTarget("splitter-node", targetSpec, targetCollector)(ColumnHeader)
);
