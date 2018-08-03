import React, { Component } from 'react'
import ExpandableListItem from './ExpandableListItem'
import NoContent from './NoContent'
import Pagination from './Pagination'
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

/**
 * List with expandable items - mobile table analogue
 */

function createData(index, name, calories, fat, carbs, protein) {
  return { id: index + 1, name, calories, fat, carbs, protein };
}
export default class DataList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      data: this.props.data,
      page: 0,
      rowsPerPage: 5,
      edit: -1,
      add: false,
      del: 0,
    };
  }

  handleChangePage = (event, page) => this.props.onChangePage(event, page)

  handleAdd = () => {
    console.log(this.state.data)
    this.setState({
      data: [
        ...this.state.data,
        createData(this.state.data.length + this.state.del, typeof this.state.data[0].name === 'string' ? '' : 0,
        typeof this.state.data[0].calories === 'string' ? '' : 0,
        typeof this.state.data[0].fat === 'string' ? '' : 0,
        typeof this.state.data[0].carbs === 'string' ? '' : 0,
        typeof this.state.data[0].protein === 'string' ? '' : 0)
      ],
      edit: this.state.data.length + this.state.del + 1,
      add: true,
    })
  }

  handleEdit = id => {
    if (this.state.edit === -1) this.setState({ edit: id })
    else {
      this.setState({ edit: -1, selected: [], add: false })
    }
  }

  handleDelete = id => {
    let newData = this.state.data.filter(v => v.id !== id)
    this.setState({ data: newData, selected: [], del: this.state.del + 1, edit: -1 })
  }

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

  render() {
    const {
      columns,
      count,
      data,
      noContentText,
      page,
      rowsPerPage,
      scrollToSelected,
      scrollOptions,
      showPagination,
      ExpansionPanelDetailsProps,
      ExpansionPanelDetailsTypographyProps,
      ExpansionPanelMoreIconProps,
      ExpansionPanelProps,
      ExpansionPanelSummaryProps,
      ExpansionPanelSummaryTypographyProps,
      SelectedExpansionPanelProps,
      TablePaginationProps,
    } = this.props

    const { add, edit, del } = this.state;

    if (!Array.isArray(data)
      || data.length === 0
      || !Array.isArray(columns)
      || columns.length === 0) {
      return <NoContent text={noContentText} />
    }

    return (
      <div>
        {
          add || edit !== -1 ?
          <Tooltip title="Save">
            <IconButton aria-label="Save" onClick={() => this.handleEdit(this.state.selected[0])}>
              <SaveIcon/>
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Add">
            <IconButton  aria-label="Add" onClick={() => this.handleAdd()}>
              <AddIcon/>
            </IconButton>
          </Tooltip>
        }
        {this.state.data.map((row, index) => (
          <ExpandableListItem
            key={index}
            handleEdit={this.handleEdit}
            handleChange={this.handleChange}
            handleDelete={this.handleDelete}
            del={del}
            index={index}
            edit={edit}
            columns={columns}
            row={row}
            data={data}
            selected={row.selected}
            scrollToSelected={scrollToSelected}
            scrollOptions={scrollOptions}
            ExpansionPanelDetailsProps={ExpansionPanelDetailsProps}
            ExpansionPanelDetailsTypographyProps={
              ExpansionPanelDetailsTypographyProps
            }
            ExpansionPanelMoreIconProps={ExpansionPanelMoreIconProps}
            ExpansionPanelProps={ExpansionPanelProps}
            ExpansionPanelSummaryProps={ExpansionPanelSummaryProps}
            ExpansionPanelSummaryTypographyProps={
              ExpansionPanelSummaryTypographyProps
            }
            SelectedExpansionPanelProps={SelectedExpansionPanelProps}
          />
        ))}
        {
          showPagination &&
          <Pagination
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            TablePaginationProps={TablePaginationProps}
            onChangePage={this.handleChangePage}
          />
        }
      </div>
    )
  }
}
