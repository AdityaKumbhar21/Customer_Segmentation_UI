import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import FileUpload from './components/FileUpload'
import CustomerSegmentationResults from './components/CustomerSegmentationResults'
import './App.css'

const CLUSTER_INTERPRETATIONS = {
  0: {
    "name": "Loyal & Engaged",
    "interpretation": "Core customer base with consistent engagement, mid-to-high frequency, and mid-level monetary contribution. Lower recency indicates recent activity.",
    "recommendations": [
      "Implement exclusive loyalty programs and tiered rewards.",
      "Tailor personalized communications and product recommendations.",
      "Encourage feedback and leverage them as brand advocates."
    ]
  },
  1: {
    "name": "At-Risk & Dormant",
    "interpretation": "Customers showing signs of disengagement: low monetary value, low frequency, and high recency. They are either churning or already inactive.",
    "recommendations": [
      "Develop targeted re-engagement campaigns with compelling offers.",
      "Offer irresistible win-back incentives for a return purchase.",
      "Investigate reasons for inactivity to prevent future churn."
    ]
  },
  2: {
    "name": "Occasional Buyers",
    "interpretation": "Customers who have made a purchase or two but lack consistent engagement. Lower monetary value and frequency, with mid-level recency. Might be price-sensitive or exploring options.",
    "recommendations": [
      "Introduce them to a wider range of products through personalized recommendations or bundles.",
      "Reinforce your value proposition to encourage future purchases.",
      "Offer targeted promotions aligned with their past behavior."
    ]
  },
  3: {
    "name": "Champions & VIPs",
    "interpretation": "Most valuable and influential customer segment. Exceptional engagement (high frequency), significant monetary contribution, and recent purchases. Highly satisfied and brand loyal.",
    "recommendations": [
      "Provide exclusive VIP treatment, priority service, and early access to new offerings.",
      "Send personalized appreciation and recognition.",
      "Leverage their enthusiasm through robust referral programs.",
      "Engage them in product development or service improvement discussions."
    ]
  }
}

function App() {
  const [segmentationResults, setSegmentationResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (file) => {
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Use environment variables for API configuration
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || '/classify_customers'
      const apiUrl = `${apiBaseUrl}${apiEndpoint}`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = 'Failed to process file'
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status-based error messages
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid file format or missing required data'
              break
            case 413:
              errorMessage = 'File size too large'
              break
            case 422:
              errorMessage = 'Invalid CSV format or missing required columns'
              break
            case 500:
              errorMessage = 'Server error occurred while processing the file'
              break
            default:
              errorMessage = `Server responded with status: ${response.status}`
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setSegmentationResults(data)
      toast.success('File processed successfully!')
    } catch (error) {
      toast.error(error.message || 'An error occurred while processing the file')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSegmentationResults(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      
      <div className="w-full px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Customer Segmentation Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Upload your customer data CSV file to get detailed segmentation analysis 
            with actionable insights and recommendations for each customer group.
          </p>
        </header>

        {!segmentationResults ? (
          <FileUpload 
            onFileUpload={handleFileUpload} 
            isLoading={isLoading}
          />
        ) : (
          <CustomerSegmentationResults 
            results={segmentationResults}
            onReset={handleReset}
            clusterInterpretations={CLUSTER_INTERPRETATIONS}
          />
        )}
      </div>
    </div>
  )
}

export default App
