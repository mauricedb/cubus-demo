import * as React from "react";
import {
  ConnectDragSource,
  DragSource,
  DragSourceSpec,
  DragSourceCollector,
  DragSourceConnector,
  DragSourceMonitor
  // ConnectDropTarget
} from "react-dnd";

import AppState from "../AppState";

interface OffspreadItemProps {
  dimension: any;
  connectDragSource: ConnectDragSource;
  swapOffspread: Function;
  appState: AppState;
}

class OffspreadItem extends React.Component<OffspreadItemProps, {}> {
  render() {
    const { dimension, connectDragSource, appState } = this.props;

    const markup = <span className="offspread">{dimension.name}</span>;

    if (appState == AppState.view) {
      return markup;
    }
    return connectDragSource(markup);
  }
}

let sourceSpec: DragSourceSpec<OffspreadItemProps> = {
  beginDrag: (props: OffspreadItemProps) => ({
    obj: {
      type: "offspread",
      dimension: props.dimension
    },
    swapOffspread: props.swapOffspread
  }),

  endDrag(props: OffspreadItemProps, monitor: DragSourceMonitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      item.swapOffspread(item.obj, dropResult.obj, dropResult.before);
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
  OffspreadItem
);
