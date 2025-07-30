#!/usr/bin/env python3
import asyncio
import json
import sys
import os
import csv
from pathlib import Path
from datetime import datetime

def ensure_json_output(func):
    """Decorator to ensure function always returns valid JSON"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_result = {
                "success": False,
                "error": f"Python script error: {str(e)}",
                "results": []
            }
            print(json.dumps(error_result))
            sys.exit(0)
    return wrapper

# Add the parent directory to Python path to import the scanner
try:
    sys.path.append(str(Path(__file__).parent.parent))

    # First check if playwright is available
    import playwright

    # Then import the scanner
    from cookie_stuffing_scanner import run_batch_scan, write_csv_report
    SCANNER_AVAILABLE = True
    print("✅ Real scanner loaded successfully", file=sys.stderr)

except ImportError as e:
    SCANNER_AVAILABLE = False
    print(f"⚠️ Real scanner not available: {e}", file=sys.stderr)
    print("📦 Install Playwright: pip install playwright && playwright install", file=sys.stderr)
except Exception as e:
    SCANNER_AVAILABLE = False
    print(f"❌ Scanner initialization error: {e}", file=sys.stderr)

async def mock_scan_url(url):
    """Mock scanner for when dependencies are not available"""
    import random

    # Simulate some scanning delay
    await asyncio.sleep(random.uniform(0.5, 2.0))

    detections = []

    # Generate realistic mock detections based on URL content
    suspicious_keywords = ["affiliate", "track", "click", "partner", "offer", "ref", "redirect"]

    if any(keyword in url.lower() for keyword in suspicious_keywords):
        # Generate mock detections for suspicious URLs
        detection_types = [
            {
                "type": "request",
                "url": url,
                "detail": f"http://suspicious-tracker.com/click?ref={random.randint(1000, 9999)}",
                "origin": url,
                "referer": "direct"
            },
            {
                "type": "cookie",
                "url": url,
                "detail": "affiliate_id=12345; tracking_pixel=true; partner_ref=abc123",
                "origin": "https://tracking-domain.com",
                "referer": url
            }
        ]

        # Randomly select 1-2 detections
        num_detections = random.randint(1, 2)
        detections = random.sample(detection_types, num_detections)

    return detections

async def mock_run_batch_scan(urls):
    """Mock batch scanner"""
    all_detections = []
    for url in urls:
        detections = await mock_scan_url(url)
        all_detections.extend(detections)
    return all_detections

def mock_write_csv_report(detections, filename="cookie_stuffing_report.csv"):
    """Mock CSV writer"""
    with open(filename, mode="w", newline="") as f:
        fieldnames = ["type", "url", "detail", "origin", "referer"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(detections)
    print(f"📄 Mock report saved to {filename}", file=sys.stderr)

async def scan_urls_api(urls):
    """
    Adapter function to run the cookie stuffing scanner and return JSON results
    """
    try:
        # Use real scanner when available, fallback to mock if dependencies missing
        if SCANNER_AVAILABLE:
            detections = await run_batch_scan(urls)
        else:
            detections = await mock_run_batch_scan(urls)
        
        # Convert detections to a more web-friendly format
        results = []
        processed_urls = set()
        
        # Group detections by URL
        url_detections = {}
        for detection in detections:
            url = detection.get('url', 'unknown')
            if url not in url_detections:
                url_detections[url] = []
            url_detections[url].append(detection)
        
        # Process each scanned URL
        for url in urls:
            processed_urls.add(url)
            threats = url_detections.get(url, [])
            
            # Determine risk level based on number and type of threats
            risk_level = "clean"
            if threats:
                threat_types = [t.get('type', '') for t in threats]
                if 'cookie' in threat_types or len(threats) >= 3:
                    risk_level = "high"
                elif 'iframe' in threat_types or len(threats) >= 2:
                    risk_level = "medium"
                else:
                    risk_level = "low"
            
            # Format threats for display
            threat_descriptions = []
            for threat in threats:
                threat_type = threat.get('type', '')
                detail = threat.get('detail', '')
                
                if threat_type == 'cookie':
                    threat_descriptions.append("Suspicious Cookie Detected")
                elif threat_type == 'request':
                    threat_descriptions.append("Suspicious Network Request")
                elif threat_type == 'iframe':
                    threat_descriptions.append("Hidden Malicious Iframe")
                else:
                    threat_descriptions.append(f"Security Threat: {threat_type}")
            
            result = {
                "url": url,
                "risk_level": risk_level,
                "threats": threat_descriptions,
                "raw_detections": threats,
                "scan_time": "completed"
            }
            results.append(result)
        
        # Also generate CSV report
        timestamp = asyncio.get_event_loop().time()
        csv_filename = f"scan_report_{int(timestamp)}.csv"
        if SCANNER_AVAILABLE:
            write_csv_report(detections, csv_filename)
        else:
            mock_write_csv_report(detections, csv_filename)
        
        return {
            "success": True,
            "results": results,
            "csv_file": csv_filename,
            "total_scanned": len(urls),
            "total_threats": len(detections),
            "scanner_type": "real" if SCANNER_AVAILABLE else "mock",
            "scanner_status": "Real-time Playwright scanner" if SCANNER_AVAILABLE else "Mock scanner (install Playwright for real scanning)"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "results": []
        }

async def main():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"success": False, "error": "No URLs provided"}))
            return

        # URLs are passed as JSON string argument
        urls = json.loads(sys.argv[1])
        result = await scan_urls_api(urls)
        print(json.dumps(result))

    except json.JSONDecodeError:
        print(json.dumps({"success": False, "error": "Invalid JSON input"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Scanner error: {str(e)}"}))

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        # Final fallback to ensure we always output JSON
        print(json.dumps({
            "success": False,
            "error": f"Critical error: {str(e)}",
            "results": []
        }))
