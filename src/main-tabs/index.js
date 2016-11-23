/**
 * Tabs widget with multiple encoder instances.
 * @module boram/main-tabs
 */

import React from "react";
import cx from "classnames";
import Icon from "react-fa";
import {useSheet} from "../jss";
import {Tabs, Tab} from "../theme";
import Instance from "./instance";

const DEFAULT_LABEL = "untitled";
const KEY_0 = 48;
const KEY_9 = 57;

@useSheet({
  tab: {
    flex: 1,
    lineHeight: "40px",
    color: "#fff !important",
    backgroundColor: "#bbb !important",
    // TODO(Kagami): The only way to style tab header height. See:
    // <https://github.com/callemall/material-ui/issues/5391>.
    // Report that.
    "& > div": {
      height: "40px !important",
    },
  },
  newTab: {
    extend: "tab",
    flex: "0 60px",
  },
  activeTab: {
    color: "#999 !important",
    backgroundColor: "#eee !important",
  },
  label: {
    width: "100%",
    padding: "0 5px",
    boxSizing: "border-box",
  },
  icon: {
    float: "right",
    fontSize: "30px",
    lineHeight: "40px",
    marginTop: -1,
  },
  iconNew: {
    fontSize: "30px",
    width: 60,
    lineHeight: "40px",
  },
  tabContent: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 40,
    bottom: 0,
  },
})
export default class extends React.Component {
  state = {tabs: [], tabIndex: 0}
  tabKey = 0
  componentWillMount() {
    this.addTab();
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleGlobaKey, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleGlobaKey, false);
  }
  addTab(label = DEFAULT_LABEL) {
    const tabs = this.state.tabs;
    const key = this.tabKey++;
    tabs.push({key, label});
    this.setState({tabs});
  }
  handleGlobaKey = (e) => {
    if (e.keyCode >= KEY_0 && e.keyCode <= KEY_9 && e.altKey) {
      let tabIndex = e.keyCode - KEY_0;
      tabIndex = (tabIndex === 0 ? 10 : tabIndex) - 1;
      if (tabIndex < this.state.tabs.length) {
        this.setState({tabIndex});
      }
    }
  };
  handleTitleChange = (i, label = DEFAULT_LABEL) => {
    const tabs = this.state.tabs;
    tabs[i].label = label;
    this.setState({tabs});
  };
  handleSelect = (tabIndex, e) => {
    this.setState({tabIndex});
  };
  handleNew = (e) => {
    e.stopPropagation();
    this.addTab();
    const tabIndex = this.state.tabs.length - 1;
    this.setState({tabIndex});
  };
  handleClose = (i, e) => {
    e.stopPropagation();
    const tabs = this.state.tabs;
    tabs.splice(i, 1);
    let tabIndex = this.state.tabIndex;
    tabIndex = Math.max(0, tabIndex);
    tabIndex = Math.min(tabIndex, tabs.length - 1);
    this.setState({tabs, tabIndex});
  };
  getLabelNode(label, i) {
    const {classes} = this.sheet;
    return (
      <div className={classes.label}>
        {label}
        <Icon
          name="remove"
          className={classes.icon}
          onTouchTap={this.handleClose.bind(null, i)}
        />
      </div>
    );
  }
  getLabelNewNode() {
    const {classes} = this.sheet;
    return (
      <Icon
        name="plus"
        title="New tab"
        className={classes.iconNew}
        onTouchTap={this.handleNew}
      />
    );
  }
  getTabTemplate({children, selected}) {
    const style = {
      display: selected ? "block" : "none",
      height: "100%",
    };
    return <div style={style}>{children}</div>;
  }
  render() {
    const {classes} = this.sheet;
    return (
      <Tabs
        value={this.state.tabIndex}
        onChange={this.handleSelect}
        inkBarStyle={{display: "none"}}
        contentContainerClassName={classes.tabContent}
        tabTemplate={this.getTabTemplate}
      >
      {this.state.tabs.map((tab, i) =>
        <Tab
          key={tab.key}
          tabKey={tab.key}
          value={i}
          label={this.getLabelNode(tab.label, i)}
          className={cx(classes.tab,
                        this.state.tabIndex === i && classes.activeTab)}
          disableTouchRipple
        >
          <Instance
            active={this.state.tabIndex === i}
            onTabTitle={this.handleTitleChange.bind(null, i)}
          />
        </Tab>
      )}
        <Tab
          tabKey={-1}
          value={-1}
          label={this.getLabelNewNode()}
          className={classes.newTab}
          disableTouchRipple
        />
      </Tabs>
    );
  }
}
