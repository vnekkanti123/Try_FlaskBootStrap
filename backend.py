import requests, random


base_url = "https://wowkhazanabackend.onrender.com/"

def get_username(phone_number):
    print("phone_number", phone_number)
    url = f"{base_url}getUserCredintials"
    headers = {'Content-Type': 'application/json'}
    payload = {"phone_number": 9390680742}
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()

def do_user_login(data):
    url = f"{base_url}login"
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()


def get_wallet(data,jwt_token):
    url = f"{base_url}get_wallet"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {jwt_token}'}
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()


def do_transactions(data,jwt_token):
    url = f"{base_url}do_transaction"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {jwt_token}'}
    
    data["client_id"] = random.randint(100000, 999999)
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        return 0, response

  
def get_transactions(data,jwt_token):
    url = f"{base_url}get_last_transactions"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {jwt_token}'}
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()

def get_transactions_history(data,jwt_token):
    url = f"{base_url}get_transactions"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {jwt_token}'}
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()

def get_wallet_history(data,jwt_token):
    url = f"{base_url}get_wallethistoryforuser"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {jwt_token}'}
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()