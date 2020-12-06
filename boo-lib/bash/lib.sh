ssmParamList () {
  aws ssm get-parameters-by-path --path "/$1/$2" --with-decryption --profile personal
}

ssmParamListValue() {
	echo "$2" | jq --raw-output ".Parameters | map(select(.Name == \"$1\"))[0].Value"
}
