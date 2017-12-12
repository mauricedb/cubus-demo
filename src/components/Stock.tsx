import * as React from 'react';
import './Stock.css';

interface StockProps {
  stock: {
    Company: string;
    Industry: string;
  };
}

class Stock extends React.Component<StockProps, {}> {
  render() {
    // console.count("Render Stock");
    const { Company, Industry } = this.props.stock;

    return (
      <div className="row" >
        <div className="company">{Company}</div>
        <div className="industry">{Industry}</div>
      </div>
    );
  }
}

export default Stock;
