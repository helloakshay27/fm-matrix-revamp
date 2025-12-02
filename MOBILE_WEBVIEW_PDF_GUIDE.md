# Mobile WebView PDF Download Guide

## Overview
The `/api/direct-pdf-download/:taskId` endpoint has been optimized for mobile app WebView compatibility with enhanced detection and support for iOS and Android platforms.

## Enhanced Features

### 1. **Mobile WebView Detection**
The page automatically detects if it's running inside a mobile WebView:
- Android WebView
- React Native WebView
- Flutter InAppWebView
- iOS WKWebView

### 2. **Automatic PDF Download**
When the page loads, it will:
1. Authenticate using the provided token
2. Load task and job sheet data
3. Generate the PDF
4. **Automatically trigger the browser's download mechanism**
5. Show success feedback
6. Auto-close after a delay (8 seconds for mobile, 4 seconds for browser)

### 3. **Extended Auto-Close Timer**
- **Mobile WebView**: 8 seconds (gives more time to handle the download)
- **Browser**: 4 seconds

## URL Structure

### Basic Usage
```
https://your-domain.com/api/direct-pdf-download/46922473?token=YOUR_TOKEN&email=user@example.com&orgId=13
```

### Full Parameters
```
https://your-domain.com/api/direct-pdf-download/:taskId?
  token=YOUR_AUTH_TOKEN&
  email=USER_EMAIL&
  orgId=ORGANIZATION_ID&
  baseUrl=https://api.example.com&
  comments=Additional%20comments
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `taskId` | ✅ Yes | The task ID to generate PDF for (in URL path) |
| `token` | ✅ Yes | Authentication token |
| `email` | ✅ Yes | User email for organization selection |
| `orgId` | ✅ Yes | Organization ID to auto-select |
| `baseUrl` | ⚠️ Optional | Base API URL (overrides organization domain) |
| `comments` | ⚠️ Optional | Additional comments to include in PDF |

## Implementation Examples

### React Native (Expo/bare)
```javascript
import { WebView } from 'react-native-webview';

const PDFDownloadScreen = ({ route }) => {
  const { taskId, token, email, orgId } = route.params;
  
  const pdfUrl = `https://your-domain.com/api/direct-pdf-download/${taskId}?` +
    `token=${encodeURIComponent(token)}&` +
    `email=${encodeURIComponent(email)}&` +
    `orgId=${orgId}`;

  return (
    <WebView
      source={{ uri: pdfUrl }}
      onFileDownload={({ nativeEvent }) => {
        // Handle download on iOS
        console.log('PDF Download:', nativeEvent);
      }}
      allowsBackForwardNavigationGestures={false}
      startInLoadingState={true}
      // Enable downloads
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
    />
  );
};
```

### Flutter (webview_flutter)
```dart
import 'package:webview_flutter/webview_flutter.dart';

class PDFDownloadScreen extends StatefulWidget {
  final String taskId;
  final String token;
  final String email;
  final String orgId;

  @override
  _PDFDownloadScreenState createState() => _PDFDownloadScreenState();
}

class _PDFDownloadScreenState extends State<PDFDownloadScreen> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    
    final pdfUrl = 'https://your-domain.com/api/direct-pdf-download/${widget.taskId}?' +
      'token=${Uri.encodeComponent(widget.token)}&' +
      'email=${Uri.encodeComponent(widget.email)}&' +
      'orgId=${widget.orgId}';

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            // Handle PDF downloads
            if (request.url.endsWith('.pdf')) {
              // Trigger your download handler
              downloadPDF(request.url);
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(pdfUrl));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Downloading PDF')),
      body: WebViewWidget(controller: controller),
    );
  }
}
```

### Android Native (WebView)
```kotlin
import android.webkit.WebView
import android.webkit.DownloadListener

class PDFDownloadActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        setContentView(webView)

        val taskId = intent.getStringExtra("taskId")
        val token = intent.getStringExtra("token")
        val email = intent.getStringExtra("email")
        val orgId = intent.getStringExtra("orgId")

        val pdfUrl = "https://your-domain.com/api/direct-pdf-download/$taskId?" +
            "token=${Uri.encode(token)}&" +
            "email=${Uri.encode(email)}&" +
            "orgId=$orgId"

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
        }

        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            // Handle PDF download
            val request = DownloadManager.Request(Uri.parse(url))
            request.setMimeType(mimetype)
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "JobSheet.pdf")
            
            val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)
            
            Toast.makeText(this, "Downloading PDF...", Toast.LENGTH_SHORT).show()
        }

        webView.loadUrl(pdfUrl)
    }
}
```

### iOS Native (WKWebView)
```swift
import WebKit

class PDFDownloadViewController: UIViewController, WKNavigationDelegate {
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.navigationDelegate = self
        view.addSubview(webView)
        
        let taskId = "46922473"
        let token = "YOUR_TOKEN"
        let email = "user@example.com"
        let orgId = "13"
        
        let urlString = "https://your-domain.com/api/direct-pdf-download/\(taskId)?" +
            "token=\(token.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")&" +
            "email=\(email.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")&" +
            "orgId=\(orgId)"
        
        if let url = URL(string: urlString) {
            webView.load(URLRequest(url: url))
        }
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, 
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url, url.pathExtension == "pdf" {
            // Handle PDF download
            downloadPDF(from: url)
            decisionHandler(.cancel)
        } else {
            decisionHandler(.allow)
        }
    }
}
```

## How It Works

1. **WebView loads the URL** with all required parameters
2. **Page automatically starts** PDF generation process
3. **Progress indicators** show the current status to the user
4. **PDF is generated** using jsPDF and downloaded automatically
5. **Browser's native download** mechanism is triggered
6. **Success message** is displayed
7. **Window auto-closes** after the appropriate delay

## Important Notes

### For Mobile Apps:
- ✅ The PDF download uses the browser's native download mechanism
- ✅ The file will be saved to the device's default download location
- ✅ Extended auto-close timer (8 seconds) gives WebView time to handle the download
- ✅ Success message indicates the download has started
- ⚠️ Your app needs to handle WebView download permissions (see examples above)

### Permissions Required:
- **Android**: `WRITE_EXTERNAL_STORAGE`, `READ_EXTERNAL_STORAGE`
- **iOS**: File access permissions (handled automatically by WebView)

### Testing:
1. Test in Chrome DevTools mobile emulator first
2. Test in actual WebView implementation
3. Verify PDF downloads to the correct location
4. Check that the window closes properly

## Troubleshooting

### PDF doesn't download in WebView
- Ensure JavaScript is enabled in WebView settings
- Check that download listener is properly configured (see examples)
- Verify file access permissions are granted

### Window doesn't close
- This is expected if the window wasn't opened by JavaScript
- The auto-close is a courtesy feature; manual close is always available

### Authentication fails
- Verify the token is valid and not expired
- Check that email and orgId match an existing organization
- Ensure baseUrl is correct if provided

## Success Response

When successful, the page will show:
- ✅ Green checkmark icon
- "Download Started" title
- Success message
- Task ID
- Auto-close countdown (mobile: 8s, browser: 4s)

## Error Response

If an error occurs:
- ❌ Red X icon
- "Download Failed" title
- Error message with details
- Task ID
- "Try Again" button

## Support

For issues or questions, please contact the development team or refer to the main project documentation.

---
**Last Updated**: November 19, 2025
**Version**: 2.0 (Mobile WebView Optimized)
