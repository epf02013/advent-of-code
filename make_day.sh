mkdir 202$1/day_$2

cp templates/main.js 202$1/day_$2/

touch 202$1/day_$2/sample.txt
touch 202$1/day_$2/input.txt

echo "adding sample.txt base on copied value"
pbpaste > 202$1/day_$2/sample.txt

