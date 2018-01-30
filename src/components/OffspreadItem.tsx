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

interface OffspreadItemProps {
  dimension: any;
  connectDragSource: ConnectDragSource;
  swapOffspread: Function;
}

class OffspreadItem extends React.Component<OffspreadItemProps, {}> {
  render() {
    const { dimension, connectDragSource } = this.props;
    
    return connectDragSource(
      <span className="offspread">{dimension.name}</span>
    );
  }
}

let sourceSpec: DragSourceSpec<OffspreadItemProps> = {
  beginDrag: (props: OffspreadItemProps) => ({
    obj: {
      type: "offspread",
      dimension: props.dimension,
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
