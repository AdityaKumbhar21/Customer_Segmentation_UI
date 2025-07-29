import { useState, useRef } from 'react'
import { toast } from 'react-hot-toast'

const FileUpload = ({ onFileUpload, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    if (!file) {
      toast.error('Please select a file')
      return false
    }

    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Only CSV files are accepted')
      return false
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return false
    }

    return true
  }

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile && validateFile(selectedFile)) {
      onFileUpload(selectedFile)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Customer Data
          </h2>
          <p className="text-gray-600 mb-6">
            Select a CSV file containing your customer data. The file should include 
            customer transaction information for segmentation analysis.
          </p>
        </div>

        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />

          <div className="space-y-4">
            {selectedFile ? (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragOver ? 'Drop your CSV file here' : 'Choose a CSV file or drag it here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Only CSV files are accepted • Max file size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          {selectedFile && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Analyze File</span>
            )}
          </button>
        </div>

        {/* File Requirements */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">File Requirements:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• CSV format only</li>
            <li>• Must contain customer transaction data</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Required columns: Invoice, StockCode, Description, Quantity, InvoiceDate, Price, Customer ID, Country</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
