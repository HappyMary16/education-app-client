import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  copyright: {
    padding: '10px',
    borderTop: `2px solid ${theme.palette.divider}`
  }
}));

export const Copyright = () => {
  const classes = useStyles();

  return (
    <Grid xs={12}>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        className={classes.copyright}
      >
        {'Copyright © Mariia Borodin '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Grid>
  );
};
