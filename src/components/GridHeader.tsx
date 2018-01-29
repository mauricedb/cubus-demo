import * as React from "react";

interface GridHeaderProps {
  caption: string;
  style: object;
}

interface GridHeaderState {}

class GridHeader extends React.PureComponent<GridHeaderProps, GridHeaderState> {
  render() {
    const { caption, style } = this.props;
    return (
      <div className="header" style={style}>
        {caption}
      </div>
    );
  }
}

export default GridHeader;
