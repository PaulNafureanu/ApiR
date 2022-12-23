class Utils:
    def credentials_are_empty(credentials: dict) -> bool:
        return not (bool(credentials['token']) and bool(credentials['client_id']) and bool(credentials['client_secret']))

    def credentials_to_dict(credentials):
        return {'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes}

    def list_to_string(list: list):
        return ' '.join(list)

    def string_to_list(str: str):
        return str.split(' ')
