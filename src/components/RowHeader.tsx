import * as React from "react";
import Tappable from "react-tappable";

import { ContextMenu, Item, Separator, IconFont } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";

import { Modal, Button } from "react-bootstrap";

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

interface RowHeaderState {
  showModal: boolean;
  showContextMenu: boolean;
  text: string;
}

const MyAwesomeMenu = () => (
  <ContextMenu id="menu_id">
    <Item leftIcon={<IconFont className="fa fa-plus" />}>Add</Item>
    <Item
      leftIcon={<IconFont className="material-icons">remove_circle</IconFont>}
    >
      Remove
    </Item>
    <Item>
      <IconFont className="fa fa-scissors" />cut
    </Item>
    <Separator />
    <Item disabled>Paste</Item>
  </ContextMenu>
);

class RowHeader extends React.PureComponent<RowHeaderProps, RowHeaderState> {
  el: HTMLElement | null = null;

  state = {
    isLeft: false,
    isRight: false,
    isTop: false,
    isBottom: false,
    isCenter: false,
    showModal: false,
    showContextMenu: false,
    text: ""
  };

  showContextMenu() {
    this.setState(oldState => {
      if (oldState.showModal || oldState.showContextMenu) {
        return oldState;
      }
      return { showContextMenu: true, text: "showContextMenu" };
    });
  }

  handleHide = () => {
    this.setState({ showModal: false, text: "" });
  };

  showMemberSelect() {
    this.setState(oldState => {
      if (oldState.showModal || oldState.showContextMenu) {
        return oldState;
      }
      return { showModal: true, text: "showMemberSelect" };
    });
  }

  onClick = e => {
    console.log("Click");
  };

  onContextMenu = e => {
    console.log("onContextMenu");
    e.preventDefault();
    this.showContextMenu();
  };

  onPress = e => {
    console.log("onPress");
    this.showContextMenu();
  };

  onTap = e => {
    console.log("onTap");
    if (e.button === 2) {
      // e.preventDefault()
      this.showContextMenu();
    } else {
      this.showMemberSelect();
    }
  };

  componentDidMount() {
    const img = new Image();
    img.src = "http://netget.ca/wp-content/uploads/2016/10/cat-hungry-icon.png";
    img.onload = () => this.props.connectDragPreview(img);
  }

  render() {
    const { showModal, text, showContextMenu } = this.state;

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
      const { isRight, isLeft, isTop, isBottom, isCenter } = this.state;

      if (isRight) {
        classes.push("drop-right");
      } else if (isLeft) {
        classes.push("drop-left");
      } else if (isTop) {
        classes.push("drop-top");
      } else if (isBottom) {
        classes.push("drop-bottom");
      } else if (isCenter) {
        classes.push("drop-center");
      }
    }

    return connectDropTarget(
      connectDragSource(
        <div
          ref={el => (this.el = el)}
          className={classes.join(" ")}
          style={style}
          // onContextMenu={this.onContextMenu}
          onClick={this.onClick}
          onContextMenu={this.onContextMenu}
        >
          <Tappable onPress={this.onPress} onTap={this.onTap}>
            {caption}
          </Tappable>

          {showContextMenu && <MyAwesomeMenu />}

          <Modal show={showModal} onHide={this.handleHide} animation={false}>
            <Modal.Header>
              <Modal.Title>Member information</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div>
                {text} for {caption}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={this.handleHide}>Close</Button>
            </Modal.Footer>
          </Modal>
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

    const dragItem = monitor.getItem();
    console.log(dragItem);

    const clientOffset = monitor.getClientOffset();
    const clientRect = component.el.getBoundingClientRect();

    let isLeft = false;
    let isRight = false;
    let isCenter = false;
    let isTop = false;
    let isBottom = false;

    if (dragItem.obj.type === "offspread") {
      isLeft = clientOffset.x < clientRect.left + clientRect.width / 4;
      isRight = clientOffset.x > clientRect.right - clientRect.width / 4;
      isCenter = !(isLeft || isRight);
    } else if (dragItem.obj.type === "row") {
      isTop = clientOffset.y < clientRect.top + clientRect.height / 2;
      isBottom = clientOffset.y > clientRect.bottom - clientRect.height / 2;
    }
    component.setState({ isTop, isBottom, isLeft, isRight, isCenter });
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
