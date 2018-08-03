export const LabelRenderer = ({ column, data }) =>
  (
    column.renderLabel
      ? column.renderLabel(column, data)
      : column.label.toUpperCase()
  )
