Username: ${name}
Password:
echo "${password}" | base64 --decode | gpg --decrypt

Key ID: ${access-key-id}
Key secret:
echo "${access-key-secret}" | base64 --decode | gpg --decrypt