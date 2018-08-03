import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { CellRenderer, LabelRenderer } from './Renderer'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const styles = theme => ({
  summaryText: {
    width: '100%',
  },
  detailsText: {
    opacity: 0.5,
    width: '100%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: '10px'
  }
})

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
class ExpandableListItem extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected && nextProps.scrollToSelected) {
      // @material-ui/core encourages ReactDOM until React find better way
      // https://@material-ui/core.com/getting-started/frequently-asked-questions/#how-can-i-access-the-dom-element-
      ReactDOM.findDOMNode(this).scrollIntoView(nextProps.scrollOptions || { behavior: 'smooth', block: 'center' })
    }
  }

  render() {
    const {
      columns,
      row,
      data,
      classes,
      selected,
      ExpansionPanelDetailsProps,
      ExpansionPanelDetailsTypographyProps,
      ExpansionPanelMoreIconProps,
      ExpansionPanelProps,
      ExpansionPanelSummaryProps,
      ExpansionPanelSummaryTypographyProps,
      SelectedExpansionPanelProps,
      edit,
      index,
      handleEdit,
      handleChange,
      handleDelete,
      del
    } = this.props

    const rootProps = selected
      ? { ...ExpansionPanelProps, ...SelectedExpansionPanelProps }
      : ExpansionPanelProps

    return (
      <ExpansionPanel {...rootProps} >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon {...ExpansionPanelMoreIconProps} />}
          {...ExpansionPanelSummaryProps}
        >
          <Typography
            classes={{
              root: classes.summaryText,
            }}
            gutterBottom
            variant="subheading"
            {...ExpansionPanelSummaryTypographyProps}
          >
            {
            edit === index + 1 + del ?
            <div className={classes.container}>
              {
                columns.map((column, index1) =>
                  <TextField
                    id={row.id}
                    label={column.label}
                    value={row[index1] === 0 ? '' : row[index1]}
                    className={classes.input}
                    onChange={handleChange(index1, row.id)}
                    type={column.numeric  ? 'number': 'text'}
                    inputProps={{
                      'aria-label': 'Description',
                    }}
                  />
                )
              }
            </div>
            : <h3 style={{ textAlign: 'center'}}>
              {
                columns.map((column, index) => {
                  if (column.primary) return row[index]
                })
              }
            </h3>
            }
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails {...ExpansionPanelDetailsProps}>
          <Typography
            classes={{
              root: classes.detailsText,
            }}
            gutterBottom
            variant="body1"
            {...ExpansionPanelDetailsTypographyProps}
          >
            <div>
              {columns
                .filter(column => !column.primary)
                .map((column, index) => (
                  <Grid key={`${column.label}-${index}`} container>
                    <Grid item xs>
                      <LabelRenderer column={column} data={data} />
                    </Grid>
                    <Grid item xs>
                      {
                        row[index]
                      }
                    </Grid>
                  </Grid>
              ))}
              <div style={{textAlign: 'center', margin: '20px'}}>
                {
                  edit !== -1 ?
                  <Tooltip title="Save">
                    <IconButton aria-label="Save" className={classes.button}  onClick={() => handleEdit(row.id)}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  :
                  <Fragment>
                    <Tooltip title="Edit">
                      <IconButton aria-label="Edit" className={classes.button}  onClick={() => handleEdit(row.id)}>
                        <EditIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" >
                    <IconButton aria-label="Delete" className={classes.button}  onClick={() => handleDelete(row.id)}>
                      <DeleteIcon/>
                    </IconButton>
                  </Tooltip>
                </Fragment>
                }
              </div>
            </div>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(ExpandableListItem)
