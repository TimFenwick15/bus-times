module.exports = {
  bus: function() {
    return new Promise((resolve, reject) => {
      const [stopNumber, serviceNumber] = ['37010123', 'X78']
      let returnText = ''

      require('http').get('http://tsy.acislive.com/pip/stop_simulator_table.asp?NaPTAN=' + stopNumber + '&bMap=0&offset=0&refresh=30&pscode=A1&dest=&duegate=90&PAC=' + stopNumber, res => {
        res.setEncoding('utf8')
        res.on('data', data => {
          returnText += data
        })
        res.on('end', _ => {
          // Have we got results?
          if (returnText.indexOf('Sorry, the system is currently not available. For timetable information ring Metroline (WY) on 0113 245 7676 or Traveline (SY) on 01709 515151.') !== - 1)
            reject('No data')

          // Get time list
          const timeList = returnText
            .split('<td width=\'20%\' align=\'right\' nowrap>')
            .filter(_ => {
              const searchTerm = _.indexOf('&nbsp;</td>')
              return searchTerm !== -1 && searchTerm < 20
            })
            .map(_ => _.split('&')[0])

          // Get service list
          const serviceList = returnText
            .split('<td width=\'25%\' nowrap>')
            .filter(_ => {
              const searchTerm = _.indexOf('&nbsp;</td>')
              return searchTerm !== -1 && searchTerm < 20
            })
            .map(_ => _.split('&')[0])

          // Get destination list
          destinationList = returnText
            .split('<td width=\'35%\' class=\'destination\' nowrap>')
            .filter(_ => {
              const searchTerm = _.indexOf('&nbsp;</td>')
              return searchTerm !== -1 && searchTerm < 20
            })
            .map(_ => _.split('&')[0])

          // Get non matching or cancelled service indices
          const removeList = []
          destinationList.forEach((_, i) => {
            if (_ === "CANCELLED")
              removeList.push(i)
            else if (serviceList[i] !== serviceNumber)
              removeList.push(i)
          })

          // Remove any entries that don't match serviceNumber or are cancelled
          // removeList needs to be reversed to ensure indices selected remain valid
          removeList.reverse()
          removeList.forEach(_ => {
            timeList.splice(_, 1)
            serviceList.splice(_, 1)
            destinationList.splice(_, 1)
          })

          // Work out from time list the minutes until each bus
          resolve('Data:' + timeList.map(_ => {
            if (_ === 'Due')
              return 1
            else if (_.indexOf('mins') !== - 1)
              return Number(_.split(' ')[0])
            else {
              const d = new Date()
              return Math.ceil((new Date(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${_}`) - new Date()) / (60 * 1000))
            }
          }).join(',') + '\r')
        })
        res.on('error', err => reject(err.message))
      })
    })
  }
}
