# Customer Segmentation UI

A beautiful and intuitive React frontend application for customer segmentation analysis. This application allows users to upload CSV files containing customer data and receive detailed segmentation results with actionable insights and recommendations.

## Features

- 🔄 **CSV File Upload**: Drag-and-drop interface with file validation
- 📊 **Customer Segmentation**: Automatic clustering with detailed analysis
- 🎯 **Interactive Results**: Filter, search, and sort customer segments
- � **Download Options**: Export results as CSV files
  - Download all segmentation results
  - Download filtered/searched results
  - Download individual cluster data
- �💡 **Actionable Insights**: Detailed interpretations and recommendations for each segment
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔔 **Toast Notifications**: Real-time feedback for user actions

## Customer Segments

The application analyzes customers into four distinct segments:

1. **Champions & VIPs** - Most valuable customers with high engagement
2. **Loyal & Engaged** - Core customer base with consistent activity
3. **Occasional Buyers** - Customers with lower engagement frequency
4. **At-Risk & Dormant** - Customers showing signs of disengagement

## Technology Stack

- **React 18** - Modern React with functional components and hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS v2.2.19** - Utility-first CSS framework
- **React Hot Toast** - Beautiful toast notifications
- **JavaScript** - No TypeScript for simplicity

## Getting Started

1. **Clone and Setup Environment**
   ```bash
   # Copy environment variables
   cp .env.example .env
   # Edit .env file with your API configuration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_ENDPOINT=/classify_customers
```

- `VITE_API_BASE_URL`: The base URL of your backend server
- `VITE_API_ENDPOINT`: The specific endpoint for customer classification

## API Integration

The application connects to your backend API using environment variables. Configure the following in your `.env` file:

- **Base URL**: Set `VITE_API_BASE_URL` to your backend server URL
- **Endpoint**: Set `VITE_API_ENDPOINT` to `/classify_customers`

The backend should:

- Accept POST requests to the configured endpoint
- Handle multipart/form-data with a file field named `'file'`
- Return customer segmentation data in the following format:

```json
[
  {
    "customer_id": "17850",
    "predicted_cluster_id": 3,
    "cluster_name": "Champions & VIPs",
    "cluster_interpretation": "Most valuable and influential customer segment...",
    "cluster_recommendations": [
      "Provide exclusive VIP treatment...",
      "Send personalized appreciation..."
    ],
    "rfm_values": {
      "MonetaryValue": 942.24,
      "Frequency": 13,
      "Recency": 0
    }
  }
]
```

## File Requirements

- **Format**: CSV files only
- **Size**: Maximum 10MB
- **Required Columns**: Invoice, StockCode, Description, Quantity, InvoiceDate, Price, Customer ID, Country
- **Content**: Customer transaction data for RFM analysis

## Development

The project structure follows React best practices:

```
src/
├── components/
│   ├── FileUpload.jsx           # File upload component
│   └── CustomerSegmentationResults.jsx  # Results display
├── App.jsx                      # Main application component
├── App.css                      # Custom styles
└── index.css                    # Tailwind CSS imports
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# Customer_Segmentation_UI
