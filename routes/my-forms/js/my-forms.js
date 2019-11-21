/* format dates */
const formatDates = () => {
    const createdAtDates = document.querySelectorAll('.date')
  
    createdAtDates.forEach(item => {
      const date = new Date(item.innerHTML)
      item.innerHTML = date.toLocaleString("en-US", {"month": "short", "day": "numeric", "year": "numeric", "hour": "numeric", "minute": "numeric"})
    })
  }

  formatDates()