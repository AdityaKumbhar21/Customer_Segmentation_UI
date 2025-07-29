import { useState } from 'react'
import { toast } from 'react-hot-toast'

const CustomerSegmentationResults = ({ results, onReset, clusterInterpretations }) => {
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('customer_id')
  const [sortOrder, setSortOrder] = useState('asc')

  // Download functionality
  const downloadCSV = (dataToDownload = null, filename = 'customer_segmentation_results.csv') => {
    const data = dataToDownload || results
    
    // Create CSV headers
    const headers = [
      'Customer ID',
      'Cluster ID',
      'Cluster Name',
      'Monetary Value',
      'Frequency',
      'Recency',
      'Cluster Interpretation',
      'Recommendations'
    ]

    // Convert data to CSV format
    const csvData = data.map(customer => [
      customer.customer_id,
      customer.predicted_cluster_id,
      customer.cluster_name,
      customer.rfm_values.MonetaryValue.toFixed(2),
      customer.rfm_values.Frequency,
      customer.rfm_values.Recency,
      `"${customer.cluster_interpretation}"`,
      `"${customer.cluster_recommendations.join('; ')}"` // Join recommendations with semicolon
    ])

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Show success notification
    toast.success(`Downloaded ${filename}`)
  }

  const downloadAllResults = () => {
    downloadCSV(results, `customer_segmentation_all_${new Date().toISOString().split('T')[0]}.csv`)
  }

  // Get cluster statistics
  const getClusterStats = () => {
    const stats = {}
    results.forEach(customer => {
      const clusterId = customer.predicted_cluster_id
      if (!stats[clusterId]) {
        stats[clusterId] = {
          count: 0,
          totalMonetary: 0,
          totalFrequency: 0,
          totalRecency: 0,
          name: customer.cluster_name
        }
      }
      stats[clusterId].count++
      stats[clusterId].totalMonetary += customer.rfm_values.MonetaryValue
      stats[clusterId].totalFrequency += customer.rfm_values.Frequency
      stats[clusterId].totalRecency += customer.rfm_values.Recency
    })

    // Calculate averages
    Object.keys(stats).forEach(clusterId => {
      const cluster = stats[clusterId]
      cluster.avgMonetary = cluster.totalMonetary / cluster.count
      cluster.avgFrequency = cluster.totalFrequency / cluster.count
      cluster.avgRecency = cluster.totalRecency / cluster.count
    })

    return stats
  }

  const clusterStats = getClusterStats()

  // Filter and sort customers
  const filteredCustomers = results
    .filter(customer => {
      const matchesSearch = customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCluster = selectedCluster === null || customer.predicted_cluster_id === selectedCluster
      return matchesSearch && matchesCluster
    })
    .sort((a, b) => {
      let aValue, bValue
      
      if (sortBy === 'customer_id') {
        aValue = a.customer_id
        bValue = b.customer_id
      } else if (sortBy === 'cluster') {
        aValue = a.predicted_cluster_id
        bValue = b.predicted_cluster_id
      } else if (sortBy === 'monetary') {
        aValue = a.rfm_values.MonetaryValue
        bValue = b.rfm_values.MonetaryValue
      } else if (sortBy === 'frequency') {
        aValue = a.rfm_values.Frequency
        bValue = b.rfm_values.Frequency
      } else if (sortBy === 'recency') {
        aValue = a.rfm_values.Recency
        bValue = b.rfm_values.Recency
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getClusterColor = (clusterId) => {
    const colors = {
      0: 'bg-blue-100 text-blue-800 border-blue-200',
      1: 'bg-red-100 text-red-800 border-red-200',
      2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      3: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[clusterId] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getClusterBadgeColor = (clusterId) => {
    const colors = {
      0: 'bg-blue-500',
      1: 'bg-red-500',
      2: 'bg-yellow-500',
      3: 'bg-green-500'
    }
    return colors[clusterId] || 'bg-gray-500'
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Segmentation Results
            </h2>
            <p className="text-gray-600">
              {results.length} customers analyzed across {Object.keys(clusterStats).length} segments
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={downloadAllResults}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download CSV</span>
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Upload New File
            </button>
          </div>
        </div>

        {/* Cluster Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(clusterStats).map(([clusterId, stats]) => (
            <div
              key={clusterId}
              onClick={() => setSelectedCluster(selectedCluster === parseInt(clusterId) ? null : parseInt(clusterId))}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCluster === parseInt(clusterId)
                  ? getClusterColor(parseInt(clusterId)) + ' ring-2 ring-offset-2 ring-blue-500'
                  : getClusterColor(parseInt(clusterId)) + ' hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{stats.name}</h3>
                <span className={`inline-block w-3 h-3 rounded-full ${getClusterBadgeColor(parseInt(clusterId))}`}></span>
              </div>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Customers:</span> {stats.count}</p>
                <p><span className="font-medium">Avg Monetary:</span> ${stats.avgMonetary.toFixed(2)}</p>
                <p><span className="font-medium">Avg Frequency:</span> {stats.avgFrequency.toFixed(1)}</p>
                <p><span className="font-medium">Avg Recency:</span> {stats.avgRecency.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cluster Details */}
      {selectedCluster !== null && clusterInterpretations[selectedCluster] && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className={`p-4 rounded-lg ${getClusterColor(selectedCluster)}`}>
            <h3 className="text-lg font-bold mb-2">
              {clusterInterpretations[selectedCluster].name}
            </h3>
            <p className="text-sm mb-4">
              {clusterInterpretations[selectedCluster].interpretation}
            </p>
            <div>
              <h4 className="font-semibold text-sm mb-2">Recommendations:</h4>
              <ul className="text-sm space-y-1">
                {clusterInterpretations[selectedCluster].recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xs mr-2 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="customer_id">Sort by Customer ID</option>
              <option value="cluster">Sort by Cluster</option>
              <option value="monetary">Sort by Monetary Value</option>
              <option value="frequency">Sort by Frequency</option>
              <option value="recency">Sort by Recency</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border bg-white border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monetary Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.customer_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customer_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClusterColor(customer.predicted_cluster_id)}`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${getClusterBadgeColor(customer.predicted_cluster_id)}`}></span>
                      {customer.cluster_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.rfm_values.MonetaryValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.rfm_values.Frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.rfm_values.Recency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No customers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSegmentationResults
