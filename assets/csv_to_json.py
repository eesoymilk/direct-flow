import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path):
    """
    Convert a CSV file to JSON format.
    
    Args:
        csv_file_path (str): Path to the CSV file
        json_file_path (str): Path to save the JSON file
    """
    # List to store all data
    data = []
    
    # Read the CSV file
    with open(csv_file_path, 'r', encoding='utf-8-sig') as csv_file:  # Use utf-8-sig to handle BOM
        csv_reader = csv.DictReader(csv_file)
        
        # Convert each row to a dictionary and append to the data list
        for row in csv_reader:
            data.append(row)
    
    # Write the data to a JSON file
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=2)
    
    print(f"Conversion complete. JSON file saved to {json_file_path}")

if __name__ == "__main__":
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define input and output file paths
    csv_file_path = os.path.join(script_dir, "businessScopes.csv")
    json_file_path = os.path.join(script_dir, "businessScopes.json")
    
    # Convert CSV to JSON
    csv_to_json(csv_file_path, json_file_path)
