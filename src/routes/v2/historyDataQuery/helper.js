const getShowTableData = (dataSource) => {
  const tableData = []
  if (dataSource && dataSource.length) {
    dataSource.forEach(data => {
      if (data.courses && data.courses.length) {
        data.courses.forEach((course, index) => {
          tableData.push({
            ...course,
            id: data.id,
            teacherName: data.teacherName,
            count: data.count,
            rowSpan: index ? 0 : data.courses.length
          })
        })
      }
    })
  }
  return tableData
}

export default {
  getShowTableData,
}