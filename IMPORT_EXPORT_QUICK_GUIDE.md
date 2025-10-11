# Import & Export - Quick Guide

## ✅ BOTH BUTTONS NOW WORKING!

### 📥 **IMPORT Button**

**What it does:**
- Opens file picker
- Imports flat data from CSV files
- Adds data to table
- Shows success message

**How to use:**
1. Click **Import** button
2. Select a CSV file
3. Data imports automatically
4. See success toast

**CSV Format:**
```csv
Tower,Flat,Flat Type,Built Up Area(Sq.Ft),Carpet Area(Sq.Ft),Name On Bill,Possession,Occupancy,Occupied By,Owner/Tenant,Site Visits,Sold,Status
FM,101,2 BHK - Apartment,1200,1000,John Doe,Yes,Yes,John Doe,Owner,5,Yes,active
FM,102,2 BHK - Apartment,1200,1000,Jane Smith,Yes,No,,,0,No,inactive
```

---

### 📤 **EXPORT Button**

**What it does:**
- Exports all flat data to CSV
- Downloads file automatically
- Named with current date

**How to use:**
1. Click **Export** button
2. File downloads automatically
3. Check your Downloads folder
4. Open in Excel/Sheets

**Filename:**
```
manage_flats_export_2025-10-10.csv
```

---

## Quick Test

### Test Import:
1. Create a CSV file with sample data
2. Click Import button
3. Select your CSV file
4. Check if data appears in table

### Test Export:
1. Click Export button
2. Check Downloads folder
3. Open the CSV file
4. Verify all data is there

---

## Features

### Import:
- ✅ CSV file support
- ✅ Excel file detection (CSV recommended)
- ✅ File validation
- ✅ Error messages
- ✅ Success count

### Export:
- ✅ All columns exported
- ✅ All rows exported
- ✅ Auto-download
- ✅ Date in filename
- ✅ CSV format
- ✅ Success message

---

## Error Messages

### Import:
- ❌ "Please upload a valid CSV or Excel file"
- ❌ "No valid data found in the file"
- ❌ "Error parsing file"

### Export:
- ❌ "Error exporting flats"

---

## Success Messages

### Import:
- ✅ "Successfully imported 10 flats"

### Export:
- ✅ "Successfully exported 50 flats"

---

## CSV Template for Import

Save this as `test_flats.csv`:

```csv
Tower,Flat,Flat Type,Built Up Area(Sq.Ft),Carpet Area(Sq.Ft),Name On Bill,Possession,Occupancy,Occupied By,Owner/Tenant,Site Visits,Sold,Status
FM,201,3 BHK - Apartment,1500,1300,Alice Johnson,Yes,Yes,Alice Johnson,Owner,3,Yes,active
FM,202,3 BHK - Apartment,1500,1300,Bob Williams,Yes,Yes,Bob Williams,Owner,2,Yes,active
MLCP1,G-15,Parking,150,150,NA,Yes,No,,,0,No,inactive
```

---

## Summary

**Import**: Click → Select CSV → Data imported ✅  
**Export**: Click → File downloads ✅

Both buttons are now fully functional! 🎉

