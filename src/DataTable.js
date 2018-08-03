import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';

function createData(index, name, calories, fat, carbs, protein) {
  return { id: index + 1, name, calories, fat, carbs, protein};
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;
    const columnData = this.props.columns;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
    width: '150px',
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, title, handleDelete, handleEdit, edit, handleAdd, add } = props;
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected.length > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected.length > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected.length} selected
          </Typography>
        ) : (
          <Typography variant="title" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected.length > 0 ? (
          <Fragment>
            {
              edit ?
              <Tooltip title="Save">
                <IconButton aria-label="Save" onClick={() => handleEdit(numSelected[0])}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              :
              <Fragment>
                <Tooltip title="Edit">
                  <IconButton aria-label="Edit"  onClick={() => handleEdit(numSelected[0])}>
                    <EditIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" >
                  <IconButton aria-label="Delete" onClick={() => handleDelete(numSelected[0])}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          </Fragment>
        ) : (
            add ?
            <Tooltip title="Save">
              <IconButton aria-label="Save" onClick={() => handleEdit(numSelected[0])}>
                <SaveIcon/>
              </IconButton>
            </Tooltip>
            :
            <Tooltip title="Add">
              <IconButton  aria-label="Add" onClick={() => handleAdd()}>
                <AddIcon/>
              </IconButton>
            </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      data: this.props.data,
      page: 0,
      rowsPerPage: 5,
      edit: 0,
      add: false,
      del: 0,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChange = (key, id) => event => {
    let newData = this.state.data.map(e => {
      if (e.id === this.state.edit) {
        return typeof e[key] === 'number' ?
        {
          ...e,
          [key]: Number(event.target.value)
        }
        :
        {
          ...e,
          [key]: event.target.value
        }
      }
      return e;
    })
    this.setState({
      data: newData
    });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);

    if (selectedIndex === -1) {
      this.setState({ selected: [id] });
    } else {
      this.setState({ selected: [] });
    }
  };

  handleAdd = () => {
    this.setState({
      data: [
        ...this.state.data,
        createData(this.state.data.length + this.state.del, '',
        typeof this.state.data[0].calories === 'string' ? '' : 0,
        typeof this.state.data[0].fat === 'string' ? '' : 0,
        typeof this.state.data[0].carbs === 'string' ? '' : 0,
        typeof this.state.data[0].protein === 'string' ? '' : 0)
      ],
      edit: this.state.data.length + this.state.del + 1,
      add: true,
    })
  }

  handleDelete = id => {
    let newData = this.state.data.filter(v => v.id !== id)
    this.setState({ data: newData, selected: [], del: this.state.del + 1 })
  }

  handleEdit = id => {
    if (!this.state.edit) this.setState({ edit: id })
    else {
      this.setState({ edit: 0, selected: [], add: false })
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, columns, title } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, edit, add } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected} title={title} handleDelete={this.handleDelete} handleEdit={this.handleEdit} handleAdd={this.handleAdd} edit={edit} add={add}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                //.sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => {
                        if (!edit) this.handleClick(event, n.id)
                      }}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} color="primary" />
                      </TableCell>
                      {
                        columns.map((column, index) =>
                          <TableCell numeric={column.numeric}>
                            {edit === n.id ?
                            <TextField
                              id={n.id}
                              label={n.label}
                              value={n[index]}
                              type={column.numeric ? 'number': 'text'}
                              onChange={this.handleChange(index, n.id)}
                              margin="normal"
                            /> : n[index]}
                          </TableCell>
                        )
                      }
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
