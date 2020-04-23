import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DepartmentsList from './DepartmentsList';
import { ListItemIcon } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

export default class Institute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.someAction = this.someAction.bind(this);
    this.instituteHandleClick = this.instituteHandleClick.bind(this);
  }

  instituteHandleClick() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  someAction() {
    console.log('action');
  }

  render() {
    const { institute, groups, departments, classes } = this.props;
    const { open } = this.state;

    return (
      <List>
        <ListItem button onClick={this.instituteHandleClick}>
          <ListItemIcon>
            <AccountBalanceIcon/>
          </ListItemIcon>
          <ListItemText primary={institute.label}/>
          <ListItemSecondaryAction>
            {/*<IconButton onClick={this.someAction}>*/}
            {/*  <EditIcon/>*/}
            {/*</IconButton>*/}
            {/*<IconButton onClick={this.someAction}>*/}
            {/*  <InfoIcon/>*/}
            {/*</IconButton>*/}
            {/*<IconButton onClick={this.someAction}>*/}
            {/*  <DeleteIcon/>*/}
            {/*</IconButton>*/}
            {open ? <ExpandLess/> : <ExpandMore/>}
          </ListItemSecondaryAction>
        </ListItem>

        <DepartmentsList
          open={open}
          groups={groups}
          departments={departments}
          classes={classes}
        />
      </List>
    );
  }
}
