import * as React from "react";

import AppState from "../AppState";

interface AppStateSwitchProps {
  setAppState: Function;
  appState: AppState;
}

class AppStateSwitch extends React.Component<AppStateSwitchProps, {}> {
  render() {
    const { appState, setAppState } = this.props;

    return (
      <div className="app-state-switch">
        <label>
          <input
            name="mode"
            type="radio"
            value={1}
            checked={appState === AppState.default}
            onChange={() => setAppState(AppState.default)}
          />
          Default
        </label>
        <label>
          <input
            name="mode"
            type="radio"
            checked={appState === AppState.design}
            onChange={() => setAppState(AppState.design)}
          />
          Design
        </label>
      </div>
    );
  }
}

export default AppStateSwitch;
