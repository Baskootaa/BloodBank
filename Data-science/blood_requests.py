import requests
import pandas as pd
import matplotlib.pyplot as plt
import arabic_reshaper
from bidi.algorithm import get_display

# Basic Links
base_url = "https://unmiraculously-nonexhaustible-shalanda.ngrok-free.dev"
login_url = f"{base_url}/api/login"

# Other Links
donors_url = f"{base_url}/api/donors"               # Doners
urgencies_url = f"{base_url}/api/blood-requests"    # Urgencies
hospitals_url = f"{base_url}/api/hospitals"         # Hospitals

headers = {
    "ngrok-skip-browser-warning": "true",
    "Accept": "application/json"
}

login_data = {
    "email": "Baskota@gmail.com",
    "password": "12345678"
}

print("1. Authenticating to retrieve access token...")
login_response = requests.post(login_url, json=login_data, headers=headers)

if login_response.status_code == 200:
    token = login_response.json().get("access_token")
    headers["Authorization"] = f"Bearer {token}"
    print("✅ Authentication Successful!\n")

    # =====================================================================
    # First Screen: Doners (pie shart)
    # =====================================================================
    print("2. Fetching Donors data...")
    donors_res = requests.get(donors_url, headers=headers)
    if donors_res.status_code == 200:
        df_donors = pd.json_normalize(donors_res.json())
        print("🎨 Generating Donors Pie Chart...")

        blood_counts = df_donors['blood_type'].value_counts()
        plt.figure(figsize=(8, 8))
        plt.pie(blood_counts, labels=blood_counts.index, autopct='%1.1f%%', startangle=140, colors=['#ff9999','#66b3ff','#99ff99','#ffcc99'])
        plt.title('Distribution of Donors Blood Types', fontsize=16)
        plt.savefig('1_donors_pie_chart.png', dpi=300, bbox_inches='tight')
        plt.show()

    # =====================================================================
    # Second Screen: Urgencies (Urgent Blood Requests)
    # =====================================================================
    print("\n3. Fetching Urgencies data...")
    urgencies_res = requests.get(urgencies_url, headers=headers)
    if urgencies_res.status_code == 200:
        df_urgencies = pd.json_normalize(urgencies_res.json())
        print("🚨 Generating Urgencies Chart...")

        grouped_urgencies = df_urgencies.groupby(['hospital.name', 'blood_type'])['bags_quantity'].sum().reset_index()

        if not grouped_urgencies.empty:
            grouped_urgencies['label'] = grouped_urgencies['hospital.name'] + " (" + grouped_urgencies['blood_type'] + ")"

            grouped_urgencies = grouped_urgencies.sort_values(by='bags_quantity', ascending=False)

            plt.figure(figsize=(10, 6))

            bars = plt.bar(range(len(grouped_urgencies)), grouped_urgencies['bags_quantity'], color='#c0392b', width=0.5)

            plt.title('Urgent Blood Requests by Hospital', fontsize=16, fontweight='bold', color='#c0392b')
            plt.xlabel('Hospital & Blood Type', fontsize=14)
            plt.ylabel('Requested Bags', fontsize=14)

            # Set Arabic language
            arabic_labels = grouped_urgencies['label'].tolist()
            fixed_labels = [get_display(arabic_reshaper.reshape(label)) for label in arabic_labels]
            plt.xticks(ticks=range(len(arabic_labels)), labels=fixed_labels, rotation=45)

            # Set Real numbers
            max_qty = int(grouped_urgencies['bags_quantity'].max())
            plt.yticks(range(0, max_qty + 2))

            for bar in bars:
                yval = bar.get_height()
                plt.text(bar.get_x() + bar.get_width()/2, yval + 0.1, int(yval), ha='center', va='bottom', fontweight='bold', fontsize=12)

            plt.grid(axis='y', linestyle='--', alpha=0.4)
            plt.tight_layout()
            plt.savefig('2_urgencies_chart.png', dpi=300, bbox_inches='tight')
            print("✅ Urgencies chart saved successfully!")
            plt.show()
        else:
            print("✅ No urgent requests found.")

    # =====================================================================
    # Third Screen: Hospitals (Filtered Blood Stocks)
    # =====================================================================
    print("\n4. Fetching Hospitals data...")
    hospitals_res = requests.get(hospitals_url, headers=headers)
    if hospitals_res.status_code == 200:
        hospitals_data = hospitals_res.json()
        print("🎨 Generating Hospitals Filtered Blood Stocks Chart...")

        records = []
        for hospital in hospitals_data:
            h_name = hospital.get('name', 'Unknown')
            stocks = hospital.get('blood_stocks', [])

            if isinstance(stocks, list):
                for stock in stocks:
                    b_type = stock.get('blood_type') or stock.get('name') or str(stock)
                    qty = stock.get('quantity') or stock.get('bags_quantity') or stock.get('amount') or 0
                    records.append({'hospital': h_name, 'blood_type': b_type, 'quantity': int(qty)})
            elif isinstance(stocks, dict):
                for b_type, qty in stocks.items():
                    records.append({'hospital': h_name, 'blood_type': b_type, 'quantity': int(qty)})

        df_stocks = pd.DataFrame(records)

        if not df_stocks.empty:
            filtered_df = df_stocks[df_stocks['quantity'] != 20].copy()

            if not filtered_df.empty:
                filtered_df['label'] = filtered_df['hospital'] + " (" + filtered_df['blood_type'] + ")"

                filtered_df = filtered_df.sort_values(by='quantity', ascending=True)

                plt.figure(figsize=(12, 8))

                colors = ['#e74c3c' if x < 20 else '#3498db' for x in filtered_df['quantity']]

                plt.barh(range(len(filtered_df)), filtered_df['quantity'], color=colors)

                plt.title('Hospitals Blood Stocks Alerts (< 20 or > 20 bags)', fontsize=16)
                plt.xlabel('Quantity of Bags', fontsize=14)
                plt.ylabel('Hospital Name & Blood Type', fontsize=14, labelpad=40)

                # Make hospitals' names in Arabic
                arabic_labels = filtered_df['label'].tolist()
                fixed_labels = [get_display(arabic_reshaper.reshape(label)) for label in arabic_labels]
                plt.yticks(ticks=range(len(arabic_labels)), labels=fixed_labels)

                plt.axvline(x=20, color='gray', linestyle='--', alpha=0.7, label='Target (20 bags)')
                plt.legend()

                plt.grid(axis='x', linestyle='--', alpha=0.4)
                plt.savefig('3_hospitals_stocks_filtered.png', dpi=300, bbox_inches='tight')
                print("✅ Filtered Hospitals chart saved successfully!")

                plt.tight_layout()
                plt.show()
            else:
                print("✅ All hospitals have perfectly 20 bags for all types! No alerts to show.")
        else:
            print("⚠️ No blood stocks data found inside the hospitals API.")

else:
    print("❌ Authentication failed:", login_response.text)
