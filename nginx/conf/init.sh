# #!/bin/sh

# # # Set the nginx certificate folder
# NGINX_CERT_FOLDER="/etc/nginx/certs"

# # # Check if the nginx certificate folder exists, create it if not
# mkdir -p "$NGINX_CERT_FOLDER"

# # # Generate a self-signed SSL certificate and key
# openssl req -subj "/CN=$HOST" -new -newkey rsa:2048 -sha256 -days 365 -nodes -x509 -keyout "$NGINX_CERT_FOLDER/ssl.key" -out "$NGINX_CERT_FOLDER/ssl.crt"

# # Optionally, you may change the ownership and permissions of the generated files
# chown root:root "$NGINX_CERT_FOLDER/ssl.key" "$NGINX_CERT_FOLDER/ssl.crt"
# chmod 600 "$NGINX_CERT_FOLDER/ssl.key" "$NGINX_CERT_FOLDER/ssl.crt"

# # Optionally, restart nginx to apply the changes
# nginx -s reload


# #!/bin/sh
while [[ "" != "$SSL_KEY" ]];do
    while [[ ! -e "$SSL_KEY" ]];do
        echo "No SSL key found, generating pair"
        openssl req -subj "/CN=$HOST/O=MindGlowing/C=BE" -new -newkey rsa:2048 -sha256 -days 365 -nodes -x509 -keyout "$SSL_KEY" -out "$SSL_CRT"
        break;
    done
    break;
done

# # trust cert to avoid curl errors
# echo "Updating certificate store"
# cp "$SSL_CRT" /usr/local/share/ca-certificates/
# update-ca-certificates